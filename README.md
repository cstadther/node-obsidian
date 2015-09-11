# node-obsidian
Node.js wrapper for the Obsidian Portal API

This is an API Wrapper for the Obsidian Portal API
* OAuth Authentication/Authorization 
* Interact with Obsidian Portal REST API

## Installation
npm install node-obsidian

## Setup and Use
	
	var nodeobsidian = require('node-obsidian');
	var obsidianAPI = new nodeobsidian({
		consumer_key: <your consumer key>,
		consumer_secret: <your consumer secret>
	});

Options & Defaults

	{
	request_token_url: 'https://www.obsidianportal.com/oauth/request_token',
    access_token_url: 'https://www.obsidianportal.com/oauth/access_token',
    authorize_url: 'https://www.obsidianportal.com/oauth/authorize',
    api_url: 'http://api.obsidianportal.com/v1',
    consumer_key: null,
    consumer_secret: null,
    access_token_callback_url: null,
    access_token: {
		token: '',
        secret: ''
    }

### Functions

All of the functions first check for a valid token.  If one is not found it tries to obtain a new one.

The callback for all functions is:

    function(err, data) {
    /* data is json data */
    }
    
#####obsidianAPI.api.user.me(format, callback)
#####obsidianAPI.api.user.show(userid, format, callback)  

#####obsidianAPI.api.campaign.show(campaignid, format, callback)
#####obsidianAPI.api.campaign.characters.list(campaignid, format, callback)
#####obsidianAPI.api.campaign.characters.show(campaignid, characterid, format, callback)

#####obsidianAPI.api.campaign.characters.create(campaignid, characterdata, format, callback)
#####obsidianAPI.api.campaign.characters.update(campaignid, characterid, characterdata, format, callback)

	Character Data Format:
	{
		'character' : 
		{
			'name' : 'BBEG',
			'tagline' : 'Awaiting in his fortress',
			'description' : 'Level 30 wizard',
			'bio' : 'Dark lord of destruction, watching from on high',
			'game_master_info' : 'Actually quite cuddly',
			'is_game_master_only' : true,
			'dynamic_sheet_template_id' : '4a938f60f24211dfba7940403656340d',
			'dynamic_sheet' : {
				'race' : 'Drow',
				'class' : 'Wizard',
				'level' : '30'
			}
		}
	}

#####obsidianAPI.api.campaign.characters.delete(campaignid, characterid, format, callback)

#####obsidianAPI.api.campaign.wikis.list(campaignid, format, callback)
#####obsidianAPI.api.campaign.wikis.show(campaignid, wikiid, format, callback)

#####obsidianAPI.api.campaign.wikis.create(campaignid, wikidata, format, callback)
#####obsidianAPI.api.campaign.wikis.update(campaignid, wikiid, wikidata, format, callback)
	Wiki Data Format:
	{
		'wiki_page' : 
		{
			'name' : 'My Newly Created Page',
			'body' : 'Body text goes here',
			'game_master_info' : 'Secrets go here',
			'is_game_master_only' : true
		}
	}

#####obsidianAPI.api.campaign.wikis.delete(campaignid, wikiid, format, callback)

#####obsidianAPI.api.dst.list(format, callback)
#####obsidianAPI.api.dst.show(dstid, format, callback)
#####obsidianAPI.api.dst.update(dstid, dstdata, format, callback)
	Dynamic Stylesheet Data Format:
	{
		'dynamic_sheet_template' : 
		{
			'html_template_submitted' : 'Different unapproved HTML here...',
			'css_submitted' : 'Different unapproved CSS here...',
			'javascript_submitted' : 'Different unapproved Javascript here...'
		}
	}
#####obsidianAPI.api.dst.submit(dstid, format, callback)

###Events

#####AfterInitialize
```
    Fires after the API has full initialized.
```    
#####UserAuthorizationReady
```
    Fires after the request token has been retrieved and the system is ready to recieve the OAuth callback.
```    
#####AfterOAuthCallback
```
    Fires after the user has been directed to the authorize page and the site had redirected the user back 
    to the OAuth Callback URL.
```    
#####AfterAccessToken
```
    Fires after the access token has been retrieved
```