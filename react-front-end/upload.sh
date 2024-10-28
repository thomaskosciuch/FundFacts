LOCAL_DIR=".dist"
S3_BUCKET="conferencesite"
aws s3 sync ${LOCAL_DIR} s3://${S3_BUCKET} --delete --acl public-read
