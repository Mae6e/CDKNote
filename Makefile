start:
	@pnpm run build
	@cdk bootstrap

build:
	@pnpm run build

deploy:
	@cdk diff
	@cdk deploy

