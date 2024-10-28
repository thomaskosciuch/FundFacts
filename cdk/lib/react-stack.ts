import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class ReactFrontEnd extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, 'FundFactsReactBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'FundFactsDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          responsePagePath: '/index.html',
          responseCode: 200,
        },
      ],
    });

    // Deploy files to the S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployFundFacts', {
      sources: [s3deploy.Source.asset('../react-front-end/dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the S3 bucket URL and CloudFront domain
    new cdk.CfnOutput(this, 'FundFactsSiteBucketURL', {
      value: siteBucket.bucketWebsiteUrl,
      description: 'URL for the S3 bucket hosting the site',
    });

    new cdk.CfnOutput(this, 'FundFactsCloudFrontURL', {
      value: distribution.distributionDomainName,
      description: 'URL for the CloudFront distribution',
    });
  }
}
