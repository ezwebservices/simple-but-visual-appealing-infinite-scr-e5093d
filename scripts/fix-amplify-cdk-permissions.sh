#!/usr/bin/env bash
set -euo pipefail

# Fix CDK bootstrap SSM permission error for Amplify deployments.
#
# NOTE: The primary fix is now embedded in amplify.yml as a pre-deploy step
# that runs automatically on every build. This script is a manual fallback
# for debugging or one-off fixes.
#
# The Amplify CodeBuild role needs ssm:GetParameter on
# /cdk-bootstrap/hnb659fds/version before CDK can deploy. Amplify may
# recreate its CodeBuild role on certain operations, wiping inline policies.
# The amplify.yml pre-deploy step handles this automatically.

ROLE_NAME="${1:-AemiliaControlPlaneLambda-CodeBuildRole-1PJH7JZRIQRPI}"
ACCOUNT_ID="073653171576"
REGION="us-east-1"
POLICY_NAME="CdkBootstrapSsmReadAccess"

echo "==> Checking if inline policy '${POLICY_NAME}' exists on role '${ROLE_NAME}'..."

if aws iam get-role-policy --role-name "$ROLE_NAME" --policy-name "$POLICY_NAME" 2>/dev/null; then
  echo "==> Policy already exists. Verifying content..."
  EXISTING=$(aws iam get-role-policy --role-name "$ROLE_NAME" --policy-name "$POLICY_NAME" --query 'PolicyDocument.Statement[0].Action' --output text 2>/dev/null || true)
  echo "    Current actions: $EXISTING"
else
  echo "==> Policy does NOT exist on the role."
fi

echo ""
echo "==> Attaching/updating inline policy '${POLICY_NAME}' on role '${ROLE_NAME}'..."

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

echo "==> Verifying policy was applied..."
aws iam get-role-policy --role-name "$ROLE_NAME" --policy-name "$POLICY_NAME" > /dev/null
echo "==> Policy verified successfully."

echo ""
echo "==> Checking for permission boundaries on the role..."
BOUNDARY=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.PermissionsBoundary.PermissionsBoundaryArn' --output text 2>/dev/null || echo "None")
if [ "$BOUNDARY" != "None" ] && [ "$BOUNDARY" != "null" ]; then
  echo "    WARNING: Role has a permission boundary: $BOUNDARY"
  echo "    The boundary must also allow ssm:GetParameter for the policy to work."
else
  echo "    No permission boundary found (good)."
fi

echo ""
echo "==> Testing SSM access with the current credentials..."
if aws ssm get-parameter --name "/cdk-bootstrap/hnb659fds/version" --region "$REGION" 2>/dev/null; then
  echo "==> SSM parameter is readable. CDK bootstrap check should pass."
else
  echo "==> WARNING: Cannot read the SSM parameter with current credentials."
  echo "    This may be expected if you're running as a different role."
  echo "    The fix will take effect when the CodeBuild role runs."
fi

echo ""
echo "==> Done. The amplify.yml build config also applies this fix automatically"
echo "    on every build as a pre-deploy step."
