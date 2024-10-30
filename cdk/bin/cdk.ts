#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReactFrontEnd } from '../lib/react-stack';
import { FlaskBackEnd } from '../lib/flask-stack';

const app = new cdk.App();
new ReactFrontEnd(app, 'FundFactsFrontEnd', {});
new FlaskBackEnd(app, 'FundFactsBackEnd', {})