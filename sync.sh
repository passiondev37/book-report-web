npm run build
aws s3 sync dist s3://app.bookrpt.com --delete
