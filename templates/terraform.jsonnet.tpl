local aws = import 'aws-sdk';
local sonnetry = import 'sonnetry';
local modules = import 'modules';

{
	'backend.tf.json': sonnetry.bootstrap('//name//'),
	'provider.tf.json': {
		providers: aws.providerAliases()
	}
}