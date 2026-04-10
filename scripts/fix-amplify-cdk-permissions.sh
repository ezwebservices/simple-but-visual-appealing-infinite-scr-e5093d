#!/usr/bin/env bash
set -euo pipefail

ROLE_NAME="AemiliaControlPlaneLambda-CodeBuildRole-1PJH7JZRIQRPI"
ACCOUNT_ID="073653171576"
REGION="us-east-1"
POLICY_NAME="CdkBootstrapSsmReadAccess"

echo "==> Attaching inline policy '${POLICY_NAME}' to role '${ROLE_NAME}'..."

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME" \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ],
        "Resource": "arn:aws:ssm:*:*:parameter/cdk-bootstrap/*"
      }
    ]
  }'

echo "==> Inline policy attached successfully."

echo "==> Running CDK bootstrap for aws://${ACCOUNT_ID}/${REGION}..."
npx cdk bootstrap "aws://${ACCOUNT_ID}/${REGION}"

echo "==> Done. Amplify should now be able to read the CDK bootstrap SSM parameter."
