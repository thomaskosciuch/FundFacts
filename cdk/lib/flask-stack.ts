import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class FlaskBackEnd extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'FlaskApiVpc', {
      maxAzs: 2,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'FlaskApiSecurityGroup', {
      vpc,
      allowAllOutbound: true,
      securityGroupName: 'flask-api-sg',
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc,
      securityGroupName: 'flask-db-sg',
    });
    dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3306), 'Allow MySQL access from any IPv4 address');

    const role = new iam.Role(this, 'FlaskApiEc2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    const ubuntuAmi = ec2.MachineImage.genericLinux({
      "us-east-1": "ami-0a6e38961e6e621b0",
      "ca-central-1": "ami-040e0e17d3965510a",
    });

    const ec2Instance = new ec2.Instance(this, 'FlaskApiInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ubuntuAmi,
      securityGroup,
      role,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      associatePublicIpAddress: true,
    });

    ec2Instance.addUserData(
      `#!/bin/bash
       sudo yum update -y
       sudo yum install -y python3 git
       python3 -m venv /home/ec2-user/venv
       source /home/ec2-user/venv/bin/activate
       pip install Flask gunicorn pymysql`
    );

    const dbSecret = new secretsmanager.Secret(this, 'DbSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'admin' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
      },
    });

    const dbInstance = new rds.DatabaseInstance(this, 'FlaskApiDatabase', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_36 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO), // Using t3.micro
      vpc,
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromSecret(dbSecret),
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
      publiclyAccessible: true,  // Set to true for external access
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });
    

    new cdk.CfnOutput(this, 'InstancePublicIP', {
      value: ec2Instance.instancePublicIp,
      description: 'Public IP of the EC2 instance',
    });
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: dbInstance.dbInstanceEndpointAddress,
      description: 'Endpoint of the MySQL database',
    });
  }
}
