bf_user_post = function() {
	this.CONTRIBUTE_URL = '/buzzfeed/_contribute';
	this.ENHANCED_URL = '/buzzfeed/_enhanced';
	this.categories = {
        '2':'Movie',
        '3':'Music',
        '4':'Tech',
        '5':'Style',
        '6':'Celebrity',
        '7':'Food',
        '9':'TV',
        '10':'Politics',
        '11':'Sports',
        '12':'Culture',
        '13':'Business',
        '15':'Science',
        '18':'Animals',
        '23':'Rewind',
        '24':'LGBT',
        '38':'TVAndMovies',
        '40':'Bestof2012',
        '43':'USNews',
        '58':'Community',
        '69':'Longform',
        '66':'UK',
        '72':'DIY',
        '78':'Ideas',
        '83':'Geeky',
        '86':'Books',
        '92':'World',
        '89':'Espanol',
        '90':'France',
        '91':'Brasil',
        '98':'Travel',
        '104':'Comics',
        '107':'Videos',
        '110':'Australia',
        '114':'Audio',
        '117':'Ukpolitics',
        '118':'India',
        '119':'Germany',
        '120':'Parents',
        '121':'Health',
        '122':'UKNews',
        '125':'Science',
        '126':'AUNews',
        '127':'Weddings',
        '128':'Comedy',
        '129':'FranceNews',
				'130':'Mexico',
	};
	this.vertical_categories = [3, 4, 5, 6, 7, 10, 11, 13, 18, 21, 23, 24, 38, 40, 43, 58, 69, 66, 72, 78, 83, 86, 92,89,90,91,98,104,107,110, 114, 122, 126, 127, 128, 129, 130];
    this.default_config = {
        team_world: { category: 'World', content_format: 'article' },
        team_travel: { category: 'Travel' },
        team_developer: {
            promotion: { 'suplist_promoted' : false, 'suplist_widget' : false },
        },
        team_creative: {
            category: 'Advertiser Post',
            promotion: { 'suplist_promoted' : false, 'suplist_widget' : false, 'suplist_index' : false, 'suplist_suggest' : false, '' : false, 'sensitive_option_id' : false },
            rating: 'tame'
        },
        team_politics: {
            category: 'Politics',
            content_format: 'article'
            // rating: 'tame'
            //special_options: [ 'autoplay', 'mobile_safe', 'inlinefood' ]
        },
        team_tech: { category: 'Tech', content_format: 'article'  },
        team_business: { category: 'Business', content_format: 'article'  },
        team_tvandmovies: { category: 'TVAndMovies' },
        team_celebrity: { category: 'Celebrity' },
        team_music: { category: 'Music' },
        team_food: { category: 'Food' },
        team_rewind: { category: 'Rewind' },
        team_lgbt: { category: 'LGBT' },
        team_sports: { category: 'Sports' },
        team_animals: { category: 'Animals' },
        team_diy: { category: 'DIY' },
        team_style : { category: 'Style' },
        team_ideas: { category: 'Ideas' },
        team_geeky: { category: 'Geeky' },
        team_espanol: { category: 'Espanol', language: 'es', promotion: { suplist_promoted : false, suplist_widget : false } },
        team_france: { category: 'France', language: 'fr', promotion: { suplist_promoted : false, suplist_widget : false } },
        team_brasil: { category: 'Brasil', language: 'pt', promotion: { suplist_promoted : false, suplist_widget : false } },
        team_germany: { category: 'Germany', language: 'de', promotion: { suplist_promoted : false, suplist_widget : false } },
				team_mexico: { category: 'Mexico', language: 'es', promotion: { suplist_promoted : false, suplist_widget : false } },
        team_comics: { category: 'Comics' },
        team_australia: { category: 'Australia' },
        team_india: { category: 'India' },
        team_podcasts: { category: 'Podcasts' },
        team_videos: { category: 'Videos' },
        team_ukpolitics: {
            category: 'Ukpolitics',
            content_format: 'article'
        },
        team_audio: { category: 'Audio' },
        team_francenews: { category: 'FranceNews', language: 'fr' }
    };
	this.__auto_complete = {};
	this.__auto_complete_elements = [];
	this.__auto_complete_idx = 0;
	// methods for preprocessing
	this.CLEANUP = {
		'prepend_http' : function(str) {
			if ( str == '' ) return '';
			else if (!str.match(/^https?:\/\//)) return 'http://'+str;
			else return str;
		},
		'trim' : function(str) {
			return str.strip();
		},
		'url_entities' : function(s) {
			if(s) {
				var newtext = '';
				var chars = s.split("");
				for(i = 0; i < chars.length; i++) {
					var chr = chars[i].charCodeAt(0);
					if( chr > 127 ) {
						newtext += encodeURIComponent(chars[i]);
					} else {
						newtext += chars[i];
					}
				}
				return newtext;
			}
		}
	};

	// methods for validation
	this.VALIDATE = {
		'required_for_non_admins':  function(str) {
			return acl.user_can('general_admin') || (str.length>0 && str != 'null');
		},
		'required' : function(str) {
			return str.length>0 && str != 'null';
		},
		'isnt_zero' : function(str) {
			return parseInt(str) != 0;
		},
		'this_or_that_checked': function( selector ) {
			var $els = $$( selector );
			return $els.length;
		}
	};

	// Map button IDs to buzz type
	this.ID_TO_TYPE_MAP = {
		'quickpost-create-link':'link',
		'quickpost-create-video':'video',
		'quickpost-create-image':'image',
		'quickpost-create-enhanced':'enhanced',
		'quickpost-create-list':'enhanced',
		'quickpost-create-quiz':'enhanced',
		'quickpost-create-recipe':'recipe',
		'quickpost-create-embed':'embed',
		'quickpost-create-super':'super'
	};

	// Map button IDs to buzz type
	this.ID_TO_ENHANCED_MAP = {
 		'quickpost-create-list':'TopList',
		'quickpost-create-quiz':'ClassifyQuiz'
	};

	// Define values for FB that differe by type
	this.FACEBOOK = {
		form_string : {
			text : '',
			quote : ' a quote ',
			link : ' a link ',
			image : ' an image ',
			video : ' a video '
		}
	};

	// structure to help with uri creation
	this.URI = {
		editing: false,
		enabled: true,
		buff: '',
		words: '',
		max_length: 60
	};

	// the foreign homepages that have thumbnails
	this.FOREIGN_HPS = ["espanol", "france", "brasil"];

	// Define unique qualities of different buzz types.
	// List forms to show for data entry, template to use for preview, and map form field to data object.
	// Mapping specifies:
	//  - name in object
	//  - optional label (for error display),
	//  - optional list of preprocess methods to run,
	//  - optional list of validation methods to run
	this.STRUCTURE = {
		'embed': {
			data_entry_form_ids : ['user-edit-quickpost','edit-quickpost-form','quickpost-embed'],
			//template : 'quickpost_embed',
			template : 'quickpost_embed preview_buzz',
			form_to_obj_map : {
				'quickpost-title' : {
					name: 'title',
					label: 'Title',
					field: 'name',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-embed-code': {
					name : 'embed',
					label : 'Embed Code',
					field : 'code',
					preprocess : [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-embed-width': {
					name : 'embed_width',
					label : 'Embed Code',
					field : 'width',
					preprocess : [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-embed-height': {
					name : 'embed_height',
					label : 'Embed Code',
					field : 'height',
					preprocess : [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-description': {
					name : 'text',
					label : 'Description',
					field : 'blurb',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-embed-image-file': {
					name : 'thumb',
					label : 'Thumbnail',
					field : 'image',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-tags': {
					name : 'tags',
					field: 'tags'
				},
				'quickpost-supertags': {
					name : 'st_category',
					field : 'st_category',
					label : 'Supertags'
				},
				'quickpost-primary_keyword': {
					name : 'primary_keyword',
					field: 'primary_keyword'
				},
				'quickpost-categorization': {
					name : 'categorization',
					field: 'category_id'
				},
				'quickpost-tame': {
					name : 'tame',
                    label : 'Rating',
					field: 'nsfw'
				},
				'buzz-type': { name : 'type' },
				'buzz-type': { name : 'buzz_type' },
				'username': { name : 'display_name' },
				'add_to_vertical_front': {name:'add_to_vertical_front'}
			}
		},
		'link': {
			data_entry_form_ids : ['user-edit-quickpost','edit-quickpost-form','quickpost-link'],
			template : 'quickpost_link preview_buzz',
			form_to_obj_map : {
				'quickpost-title' : {
					name: 'title',
					label: 'Title',
					field: 'name',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-link-url': {
					name : 'link',
					label : 'Link URL',
					field : 'link_buzz',
					preprocess : [this.CLEANUP.trim,this.CLEANUP.prepend_http,this.CLEANUP.url_entities],
					validation: [this.VALIDATE.required]
				},
				'quickpost-description': {
					name : 'text',
					label : 'Description',
					field : 'blurb',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-link-image-file': {
					name : 'thumb',
					label : 'Thumbnail',
					field : 'image',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-tags': {
					name : 'tags',
					field : 'tags'
				},
				'quickpost-primary_keyword': {
					name : 'primary_keyword',
					field: 'primary_keyword'
				},
				'quickpost-supertags': {
					name : 'st_category',
					field : 'st_category',
					label : 'Supertags'
				},
				'quickpost-categorization': {
					name : 'categorization',
					field : 'category_id'
				},
				'quickpost-tame': {
					name : 'tame',
                    label : 'Rating',
					field : 'nsfw'
				},
				'buzz-type': { name : 'type' },
				'buzz-type': { name : 'buzz_type' },
				'username': { name : 'display_name' },
				'add_to_vertical_front': {name:'add_to_vertical_front'}
			}
		},
		'image': {
			data_entry_form_ids : ['user-edit-quickpost','edit-quickpost-form','quickpost-image'],
			//template: 'quickpost_image',
			template: 'quickpost_image preview_buzz',
			form_to_obj_map: {
				'quickpost-title': {
					name: 'title',
					label: 'Title',
					field: 'name',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-image-link-url' : {
					name: 'credit_url',
					label: 'Link Image To',
					field : 'credit_url',
					preprocess : [this.CLEANUP.trim,this.CLEANUP.prepend_http,this.CLEANUP.url_entities]
				},
				'quickpost-description' : {
					name : 'caption',
					label: 'Description',
					field : 'blurb',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-image-image-file' : {
					name : 'image',
					label : 'Image',
					field : 'image_buzz',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-tags': {
					name : 'tags',
					field : 'tags'
				},
				'quickpost-primary_keyword': {
					name : 'primary_keyword',
					field: 'primary_keyword'
				},
				'quickpost-supertags': {
					name : 'st_category',
					field : 'st_category',
					label : 'Supertags'
				},
				'quickpost-categorization': {
					name : 'categorization',
					field : 'category_id'
				},
				'quickpost-tame': {
					name : 'tame',
                    label : 'Rating',
					field : 'nsfw'
				},
				'quickpost-image-image-width': { name: 'image_width', field:'image_buzz_width' },
				'quickpost-image-image-height': { name: 'image_height', field:'image_buzz_height' },
				'quickpost-image-image-thumb' : { name: 'thumb', field:'image_small' },
				'buzz-type': { name : 'type' },
				'buzz-type': { name : 'buzz_type' },
				'username': { name : 'display_name' },
				'add_to_vertical_front': {name:'add_to_vertical_front'}
			}
		},
		'video': {
			data_entry_form_ids : ['user-edit-quickpost','edit-quickpost-form','quickpost-video'],
			//template: 'quickpost_video',
			template: 'quickpost_video preview_buzz',
			form_to_obj_map: {
				'quickpost-title' : {
					name:'title',
					label:'Title',
					field:'name',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-video-url' : {
					name:'video_url',
					label: 'Video URL',
					field: 'video_url',
					preprocess : [this.CLEANUP.trim,this.CLEANUP.prepend_http,this.CLEANUP.url_entities],
					validation: [this.VALIDATE.required]
				},
				'quickpost-description' : {
					name:'caption',
					label:'Description',
					field:'blurb',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-video-image-file' : {
					name: 'thumb',
					label:'Thumbnail',
					field: 'image',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-video-ok' : {
					name:'video_ok',
					label:'Supported Video Source'
				},
				'quickpost-tags': {
					name : 'tags',
					field: 'tags'
				},
				'quickpost-primary_keyword': {
					name : 'primary_keyword',
					field: 'primary_keyword'
				},
				'quickpost-supertags': {
					name : 'st_category',
					field : 'st_category',
					label : 'Supertags'
				},
				'quickpost-categorization': {
					name : 'categorization',
					field: 'category_id'
				},
				'quickpost-tame': {
					name : 'tame',
                    label : 'Rating',
					field: 'nsfw'
				},
				'buzz-type': { name : 'type' },
				'buzz-type': { name : 'buzz_type' },
				'username': { name : 'display_name' },
				'add_to_vertical_front': {name:'add_to_vertical_front'}
			}
		},
		'enhanced': {
			data_entry_form_ids : ['user-edit-quickpost','edit-quickpost-form','quickpost-enhanced'],
			template: 'quickpost_enhanced preview_buzz',
			form_to_obj_map: {
				'quickpost-title' : {
					name:'title',
					label:'Title',
					field:'name',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-description' : {
					name:'text',
					label:'Description',
					field:'blurb',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-enhanced-image-file': {
					name : 'thumb',
					label : 'Thumbnail',
					field : 'image',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-enhanced-data': {
					name : 'enhanced-data',
					label : 'enhanced',
					field : 'description',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-tags': {
					name : 'tags',
					field: 'tags'
				},
				'quickpost-primary_keyword': {
					name : 'primary_keyword',
					field: 'primary_keyword'
				},
				'quickpost-supertags': {
					name : 'st_category',
					field : 'st_category',
					label : 'Supertags'
				},
				'quickpost-categorization': {
					name : 'categorization',
					field: 'category_id'
				},
				'quickpost-tame': {
					name : 'tame',
                    label : 'Rating',
					field: 'nsfw'
				},
				'buzz-type': { name : 'type' },
				'buzz-type': { name : 'buzz_type' },
				'username': { name : 'display_name' },
				'add_to_vertical_front': {name:'add_to_vertical_front'}
			},
			init: function( type ) {
				stub_id = user_post.ID_TO_ENHANCED_MAP[user_post.trigger_element];

				new Ajax.Request( "/static/js/enhanced/stubs/" + stub_id + "-stub.js?v=" + BF_STATIC.version,{
						method: 'get',
						onSuccess: function(o) {
							var stub = o.responseText.evalJSON();
							window[stub.id] = { stub: stub, set_field: {} };
							user_post.enhanced_js = window[stub.id];
							if (typeof stub.edit_css != "undefined")
							{
								$$('head').first().insert(new Element('link', {
									href: BF_STATIC.static_root + stub.edit_css + "?v=" + BF_STATIC.version,
									type: "text/css",
									rel: 'stylesheet'
								}));
							}

							$('quickpost-enhanced-form').show();
							new Ajax.Updater('quickpost-enhanced-form', user_post.ENHANCED_URL, {
								parameters: {
									template: stub.edit_template,
									stash: Object.toJSON(window[stub.id]),
									action: user_post.ENHANCED_URL.match(/_temp_wrapper/) ? 'enhanced' : ''
								},
								onComplete: function(el) { BF_XSS.swift_injection( BF_STATIC.static_root + stub.edit_js + "?v=" + BF_STATIC.version ) }
							});
						}
					});
				$$('.classify-enhanced-class-image').each( function (el) { el.observe('click', user_post.image_handler) } );

			},
			preprocess: function() {
				$('quickpost-enhanced-data').value = user_post.enhanced_js.as_string();
			},
			postprocess: function() {
				user_post.enhanced_js.cleanup();
			}

		},
		'super': {
			data_entry_form_ids : ['edit-quickpost-form'],
			//template : 'quickpost_link',
			template : 'quickpost_super mobile_preview_buzz mobile_preview_form preview_buzz',
			form_to_obj_map : {
				'quickpost-title' : {
					name: 'title',
					label: 'Title',
					field: 'name',
					preprocess: [this.CLEANUP.trim],
					validation: [function(val) {

						// prevent publishing if title has "Untitled Draft #######"
						var autoTitleRegex = /Untitled-? ?Draft-? ?/i;
						if( typeof user_post.save_as_draft != 'undefined' && !user_post.save_as_draft && (!val || val.match(autoTitleRegex)) ) return false;

						return true;
					}]
				},
				'quickpost-description': {
					name : 'text',
					label : 'Description',
					field : 'blurb',
					preprocess: [this.CLEANUP.trim],
					validation: [function(val){
						if( val || !( typeof user_post.save_as_draft != 'undefined' && !user_post.save_as_draft) ) return true;
						return false;
					}]
				},
				'quickpost-deks-summary': {
					name : 'short_description',
					label : 'Summary',
					field : 'short_description',
					preprocess: [function(val){
						return deksEnabledSuperlist.preprocess(val);
					}],
					validation: [function(val){
						return deksEnabledSuperlist.validate(val);
					}]
				},
				'dl-locationId': {
					field: 'location_id',
					name: 'location_id'
				},
				'quickpost-super-image-file': {
					name : 'thumb',
					label : 'Thumbnail',
					field : 'image',
					preprocess: [this.CLEANUP.trim],
					validation: [this.VALIDATE.required]
				},
				'quickpost-super-image-original': {
					name : 'original_image',
					label : 'Original Image',
					field : 'original_image',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-original_image_width': {
					name : 'original_image_width',
					label : 'Original Image Width',
					field : 'original_image_width'
				},
				'quickpost-original_image_height': {
					name : 'original_image_height',
					label : 'Original Image Height',
					field : 'original_image_height'
				},
				'quickpost-original_image_scale': {
					name : 'original_image_scale',
					label : 'Original Image Scale',
					field : 'original_image_scale'
				},
				'original_image_crop_data': {
					name : 'original_image_crop_data',
					label : 'Original Image Crop Data',
					field : 'original_image_crop_data'
				},
				'quickpost-frontpage-title' : {
					name: 'frontpage-title',
					label: 'Title',
					field: 'frontpage-title',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-frontpage-description': {
					name : 'frontpage-description',
					label : 'Description',
					field : 'frontpage-description',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-frontpage-image-file': {
					name : 'frontpage-image',
					label : 'Thumbnail',
					field : 'frontpage-image',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-frontpage_uk-title' : {
					name: 'frontpage_uk-title',
					label: 'Title',
					field: 'frontpage_uk-title',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-frontpage_uk-description': {
					name : 'frontpage_uk-description',
					label : 'Description',
					field : 'frontpage_uk-description',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-frontpage_uk-image-file': {
					name : 'frontpage_uk-image',
					label : 'Thumbnail',
					field : 'frontpage_uk-image',
					preprocess: [this.CLEANUP.trim]
				},
				'quickpost-tags': {
					name : 'tags',
					field : 'tags'
				},
				'quickpost-primary_keyword': {
					name : 'primary_keyword',
					field: 'primary_keyword',
					label: 'Primary Keyword',
					validation: [function(){
						if ( user_post.primary_keyword_locked ) {
							var pk = universal_dom.get_bucket_elements('primary_keyword')[1].value.trim();
							if (pk == '') return false;
						}
						return true;
					}]
				},
				'quickpost-supertags': {
					name : 'st_category',
					field : 'st_category',
					label : 'Supertags'
				},
				'quickpost-categorization': {
					name : 'categorization',
					field : 'category_id'
				},
				'quickpost-url': {
					field: 'uri',
					name: 'words_in_uri'
				},
				'quickpost-tame': {
					name      : 'tame',
					label     : 'Rating',
					field     : 'nsfw',
					//validation: [{'function' : this.VALIDATE.this_or_that_checked, 'params': '#suplist_rating_tame:checked, #suplist_rating_nsfw:checked'}]
					validation: [function() {
						// Haven't figured out a good workflow for confirming ratings yet.
						return true;
						if ( acl.user_can( 'general_admin' ) ) {
							var confirmed = BFW_Util.getCookie( "is_rating_confirmed" );
							if ( !confirmed ) confirmed = {};
							else confirmed = confirmed.evalJSON();
							if ( superlist.moderated || typeof confirmed[edit_post.campaignid] != 'undefined' )
								return true;
							else {
								var conf = confirm( 'This post isn\'t moderated yet. Is rating "' + $$( '.suplist_options_box.rating .active label' )[0].innerHTML + '" correct?' );
								if ( conf ) {
									confirmed[edit_post.campaignid] = true;
									BFW_Util.setCookie( {name: "is_rating_confirmed", value: Object.toJSON( confirmed )} );
								}
								return conf;
							}
						} else
							return true;
					}]
				},
				'buzz-type': { name : 'buzz_type' },
				'quickpost-sub-buzz-replacements': { name : 'sub_buzz_replacements' },
				'quickpost-sub-buzz-ids': {
					name : 'sub_buzz_ids',
					label : 'Content',
					field : 'sub_buzz_ids',
					validation: [ this.VALIDATE.required_for_non_admins ]
				},
				'quickpost-list-format': { name : 'list_format_visual', field: 'list_format_visual' },
				'quickpost-post-format': { name : 'post_format_visual', field: 'post_format_visual' },
				'quickpost-index': { name : 'f_index', field: 'f_index' },
				'quickpost-suggest': { name : 'suggest', field: 'suggest' },
				'quickpost-promoted': { name : 'f_promoted', field: 'f_promoted' },
				'quickpost-widget': { name : 'f_widget', field: 'f_widget' },
				'suplist_post_attribution': { name : 'attribution', field: 'attribution' },
				'suplist_post_source_type_visual': { name : 'source_type_visual', field: 'source_type_visual' },
				'suplist_source_value': { name : 'source_value', field: 'source_value' },
				'username': { name : 'display_name' },
				'add_to_vertical_front': {name:'add_to_vertical_front'},
				'add_to_community': {name:'add_to_community'},

				// For breaking news posts
				'developing_text': {name:'developing_text', field: 'developing_text'},
				'developing_mode': {name:'developing_mode', field: 'developing_mode'}
			},

			preprocess: function(format) {
				var named_els = ["suplist_post_source_type_visual","suplist_content_format",'suplist_rating_tame','suplist_format_wide','quickpost-tame','quickpost-post-format','quickpost-sub-buzz-ids','quickpost-sub-buzz-replacements','suplist_image_width'];

				try {
					$('quickpost-list-format').value = $F("suplist_content_format");
					if ($('suplist_index') && $F("suplist_index")) $('quickpost-index').value = 1;
					$('quickpost-queue-and-publish').value = ($('suplist_index') && $F("suplist_index")) ? 1 : 0;
					if ($('suplist_suggest') && $F("suplist_suggest")) $('quickpost-suggest').value = 1;
					if ($('suplist_promoted') && $F("suplist_promoted")) $('quickpost-promoted').value = 1;
					if ($('suplist_widget') && $F("suplist_widget")) $('quickpost-widget').value = 1;

                    //$('quickpost-tame').value = ($('suplist_rating_tame') && $('suplist_rating_tame').checked ? 'true' : 'false');

                    $('quickpost-post-format').value = ($('suplist_format_wide') && $('suplist_format_wide').checked ? 'wide' : 'standard');
                    $('quickpost-sub-buzz-ids').value = superlist.item_ids( { include_hidden: true } ).join(",");

                    $("suplist_post_source_type_visual").value = $RF($("edit-quickpost-form"), 'suplist_post_item_source_type');

					if (superlist.sub_buzz_replacements) {
						var repl = [];
						$H(superlist.sub_buzz_replacements).each(function(kv) {repl.push( kv.key + ":" + kv.value );});
						$('quickpost-sub-buzz-replacements').value = repl.join(',');
					}

					if (format == 'draft') {
						if ($('suplist_saved_draft_success')) $('suplist_saved_draft_success').hide();
						if ($('suplist_post_spinner')) $('suplist_post_spinner').show();
					}

				} catch(err) {
					named_els.each(function(el_id) { if (!$(el_id)) console.error('Page does not contain the element ' + el_id) });
					console.error(err);
				}

			}
		}

	};

	// initialize the object; this happens once per page load
	this.init = function() {
		var user_info = (new BF_User()).getUserInfo();
		if (user_info && typeof user_info.p_disable_quickpost != 'undefined'
			&& user_info.p_disable_quickpost == 'true')
		{
			if ($('select-quickpost-box')) $('select-quickpost-box').style.display = 'none';
			return true;
		}

		if ( $('draft-count') ){
			var draft_data = eval('('+$('draft-count').getAttribute('rel:data')+')');
			var can_edit_drafts = draft_data && draft_data.drafts_edit_code && bf_post_tools.has_permission(bf_post_tools.buzz_edit_permissions_decoder(draft_data.drafts_edit_code));
			if ( user_info && $('get-drafts') && ( can_edit_drafts || ( bf_username && bf_username == user_info.username ) || (acl.user_can('partners_manage') && (bf_ad=='1' || bf_partner=='1')) ) ) {
				if ( draft_data.draft_count > 0 ) $('get-drafts').show();
			}
		}
		// show bookmarks if acl 'bookmark' and on own page
    if($('get-bookmarks') && user_info.username === bf_username ){
			//run bookmarks data
      $('get-bookmarks').show();
    }

    // show get-hidden if the user is f_ad or  acl 'partners_manage'
    if($('get-hidden') && (acl.user_can('partners_manage'))){
      var hidden_count = eval('(' + $('hidden-count').getAttribute('rel:data') + ')');
      //if(hidden_count.hidden_count > 0)
      $('get-hidden').show();
    }

		if( !acl.user_can('homepage_edit')){
			$$('.vertical_options').each(function(el) { el.addClassName("hidden"); });
		}

		user_post.set_handlers();
		if ( $('video-supported-text') ) $('video-supported-text').update(BF_VIDEO_TYPES_STRING);
		if ( $('quickpost-video-label') ) $('quickpost-video-label').update('Video URL <span class="note">(' + BF_VIDEO_TYPES_STRING + ')</span>');
		if ( typeof bf_chicklet != 'undefined' ) bf_chicklet.addLink( function(e) {
			user_post.show_user_post_form( 'link' );
		});
		if (! Prototype.Browser.FF2) {
			var temp = $('quickpost-create-embed');
			if ( temp ) temp.show()
			var temp = $('quickpost-create-enhanced') ;
			if ( temp ) temp.show()
			temp = $('quickpost-create-list') ;
			if ( temp ) temp.show()
			temp = $('quickpost-create-quiz') ;
			if ( temp ) temp.show()
		}
		if ( Prototype.Browser.FF2 ) {
			if ($('unsupported-types')) $('unsupported-types').show();
		}
		if ( !user_post.initialized && window['superlist_special_tags'] ) {
			superlist_special_tags.initialize_special_tags_ui();
			superlist_special_tags.update_special_tags_ui();
		}
		user_post.initialized = true;
        //after page loaded change width of those which has 100px
        $$('.buzz_superlist_item_embed iframe').each(function(el){
            if (typeof(el.attributes['width']) != 'undefined' && el.attributes['width'].value == 100) el.attributes['width'].value = '640px';
        });
        universal_dom.assign_handler({
        	bucket:'select_vertical',
        	event:'change',
        	handler:user_post.select_vertical_changed
        });
        universal_dom.assign_handler({
        	bucket:'primary_keyword_toggle',
        	event:'click',
        	handler:user_post.edit_primary_keyword
        });
		universal_dom.assign_handler({
			bucket:'published_url_toggle',
			event:'click',
			handler:user_post.change_published_url
		});
				universal_dom.assign_handler({
					bucket:'primary_keyword',
					event:'keydown',
					handler:user_post.edit_primary_keyword_keydown
				});
		universal_dom.assign_handler({
			bucket: 'select_language',
			event: 'change',
			handler: user_post.show_or_hide_english_only
		});

        if ( acl.user_can('general_advertiser')) {
        	universal_dom.get_bucket_elements('enable_for_general_advertiser').each(function(el){
        		el.removeAttribute('disabled');
        	});
        }

        /* Set defaults (Category, Rating (tame/nsfw), Post Format, Special Options (Sensitive, Inline Display, etc)) for teams acls */
        if (typeof superlist != 'undefined' && superlist.switch_rating) {

            for (var team_category in this.default_config) {
                if (acls[team_category] && acl.user_can(team_category)) {
                    if ($('quickpost-categorization')) {
						var category_name = this.default_config[team_category].category;
						var category_option = $('quickpost-categorization').select('option[text="' + category_name + '"]').first();
						if (category_option) category_option.selected = true;

						var is_vertical = false;
						try{ is_vertical = category_option.parentNode.getAttribute('label') == "Verticals"; }
						catch(e){console.warn('Options not grouped with optgroup; assuming this is not a vertical')}

						if( is_vertical ){
							user_post.update_vertical(category_name);
							var cat = category_name.toLowerCase();
							var is_foreign = (user_post.FOREIGN_HPS.toString().indexOf(cat) != -1);
							if( is_foreign ){
								user_post.show_or_hide_english_only();
							}
						}
                    }
                    if ($('quickpost-language')) {
                        var category_option = $('quickpost-language').select('option[value="' + this.default_config[team_category].language + '"]').first();
                        if (category_option) category_option.selected = true;
                    }
                    for (var checkbox_id in this.default_config[team_category].promotion) {
                        var checkbox = $(checkbox_id);
                        if (checkbox) checkbox.checked = this.default_config[team_category].promotion[checkbox_id];
                    }
                    if (this.default_config[team_category].rating) {
                    	superlist.switch_rating(this.default_config[team_category].rating);
                    }

                    var special_options = this.default_config[team_category].special_options ? this.default_config[team_category].special_options : [];
                    for (var i = 0; i < special_options.length; i++) {
                        var special_option = $$('#select_special_tags [value="' + special_options[i] + '"]').first();
                        special_option.selected = true;
                        superlist_special_tags.select_special_tags_change($('select_special_tags'));
                    }

                    if ( typeof this.default_config[team_category].content_format != 'undefined' ) {
                    	// Set default content format in superlist for use in its "reset_all" function
                    	superlist.default_content_format = this.default_config[team_category].content_format;
                    	superlist.set_content_format( this.default_config[team_category].content_format );
						superlist.list_renumber()
                    }
                }
            }
        }
        user_post.can_add_to_homepage = acl.user_can('homepage_edit') ;
        universal_dom.get_bucket_elements('has_edit_homepage_acl').each(function(el){
						if(user_post.can_add_to_homepage){
							el.show();
						}else{
							el.hide();
						}
        });
        universal_dom.assign_handler({
        	bucket:'community_info',
        	handler:user_post.load_community_info
        });

		//switch view draft/preview if user can view drafts (see edit post show_flag)
		if ( acl.user_can( 'edit_user_posts' ) && ( typeof edit_post == 'undefined' || typeof edit_post.draft == 'undefined' || edit_post.buzz.status == 'draft') ) {
			if ($$('.quickpost-view-draft').length) {
				$$('.quickpost-view-draft').each(function(el){ el.show(); });
			}
			if ( $( 'quickpost-preview-super' ) ) $( 'quickpost-preview-super' ).hide();
		}
        /* Fix for set min-height to #suplist_left_post_controls */
        if(typeof(bf_qp_sidebar) != 'undefined' ) {
            EventManager.observe( 'user_post:load:done', function() {
                bf_qp_sidebar.validate_page_content_height();
            });
        }

		EventManager.observe("user_post:error:show", user_post._show_quickpost_error);
		EventManager.observe("user_post:error:hide", user_post._hide_quickpost_error);

	}

	this.show_or_hide_english_only = function(obj) {
		var is_foreign_post = false;
		var language_dropdown = $('quickpost-language');
		if(typeof language_dropdown !== 'undefined'){
			var language = language_dropdown.options[language_dropdown.selectedIndex];
			if( typeof language !== 'undefined' && language.value != 'en' ){
				is_foreign_post = true;
			}
		}
		if ( is_foreign_post ) {
			['suplist_promoted','suplist_widget'].each( function(id){
				if ( $(id) ) $(id).checked = false;
			});
		}
		universal_dom.get_bucket_elements('english_only').each( function(el){
			if ( is_foreign_post ) el.addClassName('hidden');
			else el.removeClassName('hidden');
		});
	}

	this.limit_categories_by_acl = function( select_element ) {
		if ( !select_element ) return;
        var categoryList = select_element;
        var categories_limited_by_acls = [
            { category : '89', acls : ['team_espanol'] },
            { category : '90', acls : ['team_france'] },
            { category : '91', acls : ['team_brasil'] },
            { category : '119', acls : ['team_germany'] },
						{ category : '129', acls : ['team_mexico'] }
        ];
        categories_limited_by_acls.each( function(record){
        	var delete_it = true;
        	record.acls.each( function(ck){
        		if ( acls[ck] && acl.user_can(ck) ) delete_it = false
        	})
        	if ( delete_it && categoryList ) {
        		var options = categoryList.options;
        		for ( var i = options.length - 1; i >= 0; i-- ) {
        			if ( options[i].value == record.category ) {
        				// Note: if you change this to categoryList.remove(i), IE9 dies hard because of optgroups
        				options[i].disabled = true;
        			}
        		}
        	}
        });
	}

	this.select_vertical_changed = function(obj) {
		var selected_option = obj.target.options[ obj.target.selectedIndex ];
		if ( selected_option.value == 0 ) {
			if ( typeof user_post.previously_selected_vertical_index != 'undefined' ) {
				var idx = user_post.previously_selected_vertical_index ;
				obj.target.options[idx].selected = true ;
				selected_option = obj.target.options[idx] ;
			}
		}
		user_post.previously_selected_vertical_index = obj.target.selectedIndex;
		var previous_vertical_id = $('quickpost-categorization').options[user_post.previously_selected_vertical_index].value;
        $s('body').setAttribute('data-category-id', previous_vertical_id);
		var is_vertical = false;
		try{ is_vertical = selected_option.parentNode.getAttribute('label') == "Verticals"; }
		catch(e){console.warn('Options not grouped with optgroup; assuming this is not a vertical')}

		var vertical_name = user_post.categories['' + selected_option.value] || '';
		if ( is_vertical && !vertical_name ) return console.warn('Selected a vertical that is not recognized in user_post. Make sure categories are consistent across DB, DAOs and JS files');
		if ( is_vertical ){
			user_post.update_vertical(vertical_name);
		}
	}

	this.add_to_vertical_changed = function(obj) {
		//console.log('add_to_vertical_changed')
	}

	this.update_vertical = function(vertical_name) {
		var hide = function(el){el.addClassName('hidden')}
		universal_dom.get_bucket_elements('add_to_vertical_front').each( hide );
		universal_dom.get_bucket_elements('show_selected_vertical_name').each( hide );

		var ck_acl = ('queue_add_' + vertical_name).toLowerCase();
		if ( vertical_name.toLowerCase().match(/^(espanol|france|uk|australia)$/) ) { ck_acl = (vertical_name + '_homepage_edit').toLowerCase(); }
		if ( !acl.user_can("megaphone") && acl.user_can(ck_acl) ) { // TEMPORARY -- Hide option for users with megaphone ACL
			universal_dom.get_bucket_elements('add_to_vertical_front').each( function( el ){
				if((vertical_name).toLowerCase() != 'community') {
					el.checked = true;
				}
				el.removeClassName('hidden');
				el.value = vertical_name;
			});
			universal_dom.get_bucket_elements('show_selected_vertical_name').each( function( el ){
				el.removeClassName('hidden');
				var destination = 'vertical front page';
				if ( vertical_name.toLowerCase().match(/^(espanol|france|brasil|uk|australia)$/) ) { destination = 'Homepage Flow'; }

				var display_vertical_name = vertical_name;
				if (vertical_name == 'Ukpolitics') { display_vertical_name = 'UK Politics' }
				else if (vertical_name == 'UKNews') { display_vertical_name = 'UK News' }
				else if (vertical_name == 'USNews') { display_vertical_name = 'US News' }
				el.update('Add to <b>' + display_vertical_name + '</b> ' + destination);
			} )
		}

		// show BuzzFeed News checkbox for LGBT, Music, TVandMovies, Science
		// Books, Celebrity, Health, Longform, and Sports (#86551840, #86551840, #78720176)
		if (acl.user_can('buzzfeed_news_crossposting')) {
			var el = $$('div.buzzfeed_news_crossposting')[0];
			if (el && ['Music', 'LGBT', 'TVAndMovies', 'Sports', 'Science', 'Books', 'Celebrity', 'Health', 'Longform'].indexOf(vertical_name) != -1 ) {
				if (el.hasClassName('hidden')) el.removeClassName('hidden');
			}
			else {
				if (!el.hasClassName('hidden')) {
					el.addClassName('hidden');
					// when hiding BF News checkbox, also remove buzzfeed-news-crossposting tag so that it uncheck BF News checkbox
					superlist_special_tags.remove_special_tag('buzzfeed-news-crossposting');
				}
			}
		}
	}

	// set buzz type in form, clear all values from the form, then display appropriate form parts for this type
	this.show_user_post_form = function( type ) {
		if( $('bookmarklet-loading-div') ) $('bookmarklet-loading-div').hide();
		this.reset_post_form();
		$('buzz-type').value = type;
		var post_structure = user_post.STRUCTURE[type];
		var forms = post_structure.data_entry_form_ids;
		for( var i = 0; i < forms.length; i++ ) {
			var f = $(forms[i]);
			if ( f.id == 'edit-quickpost-form') f.showOnScreen();
			else f.show();
		}
		if (typeof post_structure.init != 'undefined') post_structure.init(type);
		if ( $('quickpost-save-as-draft') ) $('quickpost-save-as-draft').show();
		if ( $('quickpost-save-as-draft-button') && typeof contest_manager=='undefined') $('quickpost-save-as-draft-button').show();
	}

	// Clear out all data and validation-related classes from user post form
	this.reset_post_form = function() {
		//reset_post_form and show_user_post_form nowhere called with bind/apply/call so I just replace this.message with user_post.message for easier search and possible future refactoring
		user_post.message('quickpost-error-msg',{hide:true, message:''});
		var hide_ids = ['quickpost-enhanced-form','quickpost-enhanced','quickpost-embed','quickpost-link','quickpost-image','quickpost-video','quickpost-video-thumb-msg','link-thumbnail','enhanced-thumbnail','video-link-thumbnail','image-preview','image-preview-div'];
		var clear_values = ['quickpost-embed-image-file','quickpost-link-image-file','quickpost-video-image-file','quickpost-image-image-thumb','quickpost-image-image-file'];
		var clear_src = ['link-thumbnail','enhanced-thumbnail','video-link-thumbnail','image-preview'];
		for ( var i = 0; i < hide_ids.length; i++ ) {
			var target = $(hide_ids[i]);
			if (target) target.hide();
		}
		for ( var i = 0; i < clear_values.length; i++ ) {
			var target = $(clear_values[i]);
			if (target) target.value = '';
		}
		for ( var i = 0; i < clear_src.length; i++ ) {
			var target = $(clear_src[i]);
			if (target) target.src = '';
		}
		if ($('quickpost-video-ok')) $('quickpost-video-ok').value='true';
		if ($('quickpost-video-thumb-msg')) $('quickpost-video-thumb-msg').update('');
		if ($('embed-preview')) $('embed-preview').update('');
		this.clear_form_of_errors();
		$('edit-quickpost-form').reset();
	}

	// Clear out all validation-related classes from user post form
	this.clear_form_of_errors = function() {
		var form = $('edit-quickpost-form');
		var divs = form.getElementsByTagName('DIV');
		var missing_regex = new RegExp('missing', 'i');
		var error_regex = new RegExp('error', 'i');
		for ( var i = 0; i < divs.length; i++ ) {
			this.remove_class( divs[i], missing_regex );
		}
		for ( var i = 0; i < form.elements.length; i++ ) {
			this.remove_class( form.elements[i], error_regex );
		}
        $$('.missing').each(function(item){ item.removeClassName('missing'); });
	}

	// request preview of data
	// for enhanced types, we must call save_panel, which will call the _preview_from_server method after it is done;
	// for other types, just call _preview_from_server directly.
	this.preview_from_server = function( obj, fn ) {
		if ( obj.buzz_type=='enhanced') {
			user_post.save_panel(user_post.enhanced_js.as_string(), obj, fn);
		}
		else {
			this._preview_from_server( obj, fn );
		}
	}

	// this is the real logic for preview.
	this._preview_from_server = function( obj, fn ) {
		if ($('quickpost-spinner')) $('quickpost-spinner').show();
		var user = new BF_User();
		var userInfo = user.getUserInfo();
		obj.display_name = (userInfo.display_name=='' || typeof userInfo.display_name == 'undefined') ? userInfo.username : userInfo.display_name;

		obj.username = ($('username') && $F('username').length > 0) ? $F('username') : userInfo.username;

		if(userInfo.image && userInfo.image != null && userInfo.image != 'null') {
			obj.user_image = userInfo.image;
		} else {
			obj.user_image = '/static/images/public/defaults/user_large.jpg';
		}
		obj.action = 'process';
		obj.preview = 'true';
		obj.since_minutes = '1';
		obj.static_root = parent ? parent.BF_STATIC.static_root : BF_STATIC.static_root;
		obj.web_root = parent ? parent.BF_STATIC.web_root : BF_STATIC.web_root;
		obj.image_root = parent ? parent.BF_STATIC.image_root : BF_STATIC.image_root;
		obj.big_image_root = parent ? parent.BF_STATIC.image_root : BF_STATIC.image_root;
		// terminal-preview variables
		var user = new BF_User();
		var user_info = user.getUserInfo();
		obj.page='Buzz';
		obj.buzz = {
			badges:[],
			blurb:obj.caption?obj.caption:(obj.text?obj.text:obj.blurb),
			call_to_action:'',
			campaignid:obj.campaignid?obj.campaignid:0,
			category_name:user_post.categories[obj.categorization+''] ? user_post.categories[obj.categorization+''] : '',
			click:'',
			contribution:{
				link:1,
				video:1,
				image:1,
				quote:1,
				text:1
			},
			clientid:1,
			commentary_raw_html:obj.commentary_raw_html ? obj.commentary_raw_html : 0,
			credit_url:obj.credit_url,
			display_name:user_info.display_name,
			fedcount:'',
			form:obj.buzz_type,
			image:obj.thumb,
			image_buzz:obj.image,
			image_buzz_height:obj.image_height,
			image_buzz_width:obj.image_width,
			impressions:'',
			link_buzz:obj.link,
			links:[],
			name:obj.title,
			origin:'quickpost',
			parent:0,
			short_description:obj.short_description,
			since_minutes:1,
			tag_list: obj.tags ? obj.tags.split(',') : [],
			title_is_excerpt:'',
			unix_time:'1234567890',
			uri:obj.uri?obj.uri:'',
			user_id:0,
			user_image:'',
			username:obj.username,
			video_url:obj.video_url,
			code:obj.embed,
			list_format_visual:obj.list_format_visual?obj.list_format_visual:'no_list',
			post_format_visual:obj.post_format_visual?obj.post_format_visual:'standard',
			preview_mode:true
		};
		obj.buzz.tag_list.push(obj.st_category);

		if ( obj.buzz.code ) {
			var width = $F( 'quickpost-embed-width' );
			var height = $F( 'quickpost-embed-height' );
			obj.buzz.embed_data = {
				width:width,
				height:height,
				embed_domain:'/'
			}
		}
		if ( obj.buzz.form == 'image' ) obj.buzz.image='';
		user_post.posted_buzz = obj.buzz;

		if( obj.preview_raw ) {
			obj.buzz.name = obj.buzz.name.replace(/'/g, "\\'");
		}

		obj.buzz = Object.toJSON(obj.buzz);


		if( obj.preview_raw ) {
			delete obj.preview_raw;
			var form = document.createElement('form');
			form.target = BF_STATIC.bf_test_mode ? '' : '_blank';
			if ( $("qp_superlist").hasClassName("qp_is_edit_draft") ) {
				form.action = '/buzzfeed/_draft/' + obj.live_id;
				obj.buzz_preview = 1;
			} else {
				form.action = '/buzzfeed/_buzz_preview';
			}
			form.method = 'POST';
			for(var name in obj) {
				var input = document.createElement('input');
				input.type = 'hidden';
				input.name = name;
				input.value = obj[name];
				form.appendChild(input);
			}
			document.documentElement.appendChild(form);
			form.submit();
			form.remove();
			fn({'success': true});
		} else {
			if ( !user_post.save_as_draft ) {
				if (window['superlist']) {
					// there's really no need to render a preview in superposter as we don't show it.
					// just call the onsuccess directly.
					return fn( null, obj );
				}
				var ajax = new BF_Request();
				ajax.request('/buzzfeed/_template', {
					method:'post',
					parameters: obj,
					onSuccess: fn,
					onFailure: function(resp){(new BF_Request()).alert('Error contacting server');if ($('quickpost-spinner')) $('quickpost-spinner').hide()},
					bf_auth: true
				});
			} else {
				fn({responseText:Object.toJSON({
					success : true
				})},obj);
			}
		}
	}

	this.save_panel = function ( app_json, obj, fn ) {
		json = eval('('+app_json+')');
		var ajax = new BF_Request();
		ajax.request( user_post.ENHANCED_URL,{
			parameters: {
				template: json.stub.public_template,
				stash: '{ "enhanced":' + app_json + ', "image_root":"'+BF_STATIC.image_root+'"}',
				action: user_post.ENHANCED_URL.match(/_temp_wrapper/) ? 'enhanced' : ''
			},
			onComplete: function(o){
				obj.short_description = user_post._cleanup_wide_chars( o.responseText.replace(/\n/g,'') );
				obj.commentary_raw_html=1;
				user_post._preview_from_server( obj, fn );
			}
		});
	};

	this._cleanup_wide_chars = function( str ) {
		var value;
		try{
		var cleanup_div = document.createElement('div');
		var cleanup_input = document.createElement('input');
		cleanup_div.setAttribute('style', 'display:none');
		cleanup_input.setAttribute('style', 'display:none');
		document.getElementsByTagName('BODY')[0].appendChild(cleanup_div);
		document.getElementsByTagName('BODY')[0].appendChild(cleanup_input);
		cleanup_div.update( str.replace(/\n|\r\n\r\n/g, '<br class="temp">') );
		cleanup_input.value = cleanup_div.innerHTML;
		value = cleanup_input.value.replace(/<br class="temp">/g, '\n');

		cleanup_div.parentNode.removeChild( cleanup_div );
		cleanup_input.parentNode.removeChild( cleanup_input );
		} catch(e){}
		return value || str;
	}

	// show preview on screen
	this.preview_from_server_ok = function( r ) {
		if( !r ) { return; }
		if ($('quickpost-spinner')) $('quickpost-spinner').hide();
		var obj = eval( '('+ r.responseText +')' );
		if( !obj ) return;

		if ( obj.success ) {
			if ( obj.snippet ) {
				var html = obj.snippet;
				html = "<div id='list-of-buzz-preview'><ul class='flow'>" + html + "</ul></div>";
				if ($('contribute-preview-content')) {
					$('contribute-preview-content').update( html );
					if (!obj.preview_buzz) $('contribute-preview').show();
					else $('contribute-preview').hide();
				}
			}
		} else {
			var error_msg = '';
			for( var key in obj.errors ) {
				if ( error_msg != '' ) error_msg += ', ';
				error_msg += obj.errors[ key ];
			}
			user_post.error('quickpost-error-msg',{show:true,message:error_msg});
			$('quickpost-error-msg').scrollTo();
			$('contribute-preview').hide();
		}
	}

	this.do_preview_from_server_and_save = function( r, data ) {
		//console.log('user_post.preview_from_server_and_save');
		try{
			user_post.preview_from_server_ok(r);
			EventManager.fire( 'user_post:save:preparing', data);
			if ($('quickpost-spinner')) $('quickpost-spinner').show();
			var obj = r ? eval('('+r.responseText+')') : false;
			$('user_post_preview').hide();
			data.not_promoted = 1;
			if ($('quickpost-publish') && $('quickpost-publish').checked) delete data.not_promoted ;
			if (user_post.save_as_draft) data.draft = 1;
			if($('quickpost-language') && typeof $('quickpost-language').value !== 'undefined'){
				data.language = $('quickpost-language').value;
			}
			// Thumbnail url not necessary if automatically retrieved
			if( data.buzz_type == 'video' && ! user_post.is_video_thumbnail_uploaded() )
				delete data.thumb;

			if ($('quickpost-queue') && $('quickpost-queue').checked) { data.queue_it = 1; }
			if ($('quickpost-queue-and-publish') && $('quickpost-queue-and-publish').value == 1) { data.queue_and_publish = 1; }

			var params = {
				method:'post',
				parameters:data,
				onSuccess: function(resp){
					user_post.save_ok(resp, data)
				},
				onFailure: function(resp){
					user_post.save_failed(resp);
				}, bf_auth: true
			}
			var user_info = (new BF_User()).getUserInfo();
			if ( user_info.username ) { params.needsToken = true; } // in case of anonymous Boost user
			if( data.f_index && data.f_index == 1 && acl.user_can('general_admin') && !acl.user_can('queue_super_admin')){
				if( !(data.draft && data.draft == 1) && !(data.queue_it && data.queue_it == 1) && !((new BF_User()).getUserInfo().f_ad == 'true') ){
					data.f_index = 0;
					data.fq_suggest = 1;
					if($('hp_queue_label')){
						$('hp_queue_label').innerHTML = " Suggest for HP Queue?";
					}
				}
			}
			if ( !obj || obj.success ) {
				var user_info = (new BF_User()).getUserInfo();
				var selected = ((typeof edit_post != 'undefined') && (typeof edit_post == 'object') && (typeof edit_post.buzz != null) && (typeof edit_post.buzz == 'object') && edit_post.buzz.username) ? edit_post.buzz.username : user_info.username;
				if (typeof BF_UserSwitcher != 'undefined' && BF_UserSwitcher.selected_user != null && BF_UserSwitcher.selected_user != selected) {
					params.parameters.switch_username = params.parameters.username = BF_UserSwitcher.selected_user;
				}
				var ajax = new BF_Request();
				ajax.request(user_post.CONTRIBUTE_URL, params);
			}
		} catch(e) { console.error(e); }
	}

	// show preview on screen, then save user post
	this.preview_from_server_and_save = function( r, data ) {
		bfjemplate.load_if_missing({
			id: "user_post_preview",
			callback: user_post.do_preview_from_server_and_save,
			context: user_post,
			args: arguments
		});
	}

    // upon successful save, send to FB (if desired), clear form, update page with new user post
    this.save_ok = function( r, data ) {
	    //console.log('user_post.save_ok')
        var json = eval( '('+r.responseText+')' );
        if ( json.updated ) {
            if (!json.draft && $('quickpost-saved') && json.uri) user_post.activate_success_message(json.id, data.username, json.uri, data.title);
	          // timeout needed to let share content load...
            setTimeout(function() {
                if (!json.draft && $('quickpost-saved')) $('quickpost-saved').show();
                if (!json.draft && typeof gtrack != 'undefined' ) {
                    gtrack.trackShares(26, 'numPosts'); // Push 2 GA
                    gtrack.track_events("", "post/publish", data.type);
                }
                BFW_Util.updateInfoCookie({last_active:json.last_active});
                user_post.buzz = json;
                data.id = user_post.buzz.id;
                if ( $('embed-preview') ) $('embed-preview').hide();

                var fb_post = $('facebook_post_contribution_checkbox');
                data.form_string = user_post.FACEBOOK.form_string[data.buzz_type];
                data.uri = json.uri;

                if (! data.text && data.caption ) data.text = data.caption;
                if (! data.blurb && data.text ) data.blurb = data.text;
                data.image_src = json.thumb;
                if ( typeof social != 'undefined' && social.quickpost )  social.quickpost( data );

                if ( !json.draft && !data.anonymous ) {
                    user_post.copy_preview_to_list(json);
                } else if (!data.anonymous){
                    user_post.saved_as_draft_notice(json);
                }

                if (!data.anonymous) {
                    if (!$('qp_superlist')) user_post.reset_post_form();
                    if ($('user-edit-quickpost')) $('user-edit-quickpost').hide();
                    if ($('quickpost-spinner')) $('quickpost-spinner').hide();
                    if ($('contribute-preview')) $('contribute-preview').hide();
                    if ($('select-quickpost-box')) $('select-quickpost-box').show();
                }

                if (typeof(return_tracker) != 'undefined') return_tracker.track_goal('post')
                EventManager.fire( 'user_post:save:success', {data:data,json:json});
            }, ($('quickpost-saved') ? 1000 : 1));
        } else {
            user_post.save_failed(json);
        }

        if (json.draft) {
			superlist._buzz_status = 'draft';
		}

		if (json.isAd === "1" && json.campaign_approvals_log) {
			bf_campaign_approvals.sync(json.campaign_approvals_log);
		} else if (json.isAd !== "1" && acl.user_can('options_editorial')) {
			bf_qp_workflow.display(json.campaign_approvals_log ? json.campaign_approvals_log : {}, json.id);
		}

		if (json.id && json.sub_buzz) {
			superlist.load_ok(r);
		}

        // submit to superfeedr if not a draft
        if ( !json.draft && !json.queued && document.superfeedr ) document.superfeedr.submit();
    }

	this.update_element = function( id, content ) {
		var parent = $(id).parentNode;
		var span = document.createElement('span');
		span.innerHTML = content ;
		span.id = id;
		parent.replaceChild( span, $(id) );
	}

	// upon unsuccessful save, notify user
	this.save_failed = function( obj ) {
    try {
  		if ($('quickpost-spinner')) $('quickpost-spinner').hide();
  		if( typeof obj != 'undefined' && obj.error == 'duplicate name') {
  			user_post.message('quickpost-error-msg',{ show:true, message: "You already have a post by that name. Please try a different name." });
			} else if( typeof obj != 'undefined' && obj.error == 'duplicate uri') {
				user_post.message('quickpost-error-msg',{ show:true, message: "You already have a post with that url. Please try a different url." });
  		} else if ( typeof obj != 'undefined' && obj.error && obj.error.match('non-whitelisted') ) {
  			user_post.message('quickpost-error-msg',{ show:true, message: "We currently support only youtube and vimeo embeds." });
  		} else if ( typeof obj != 'undefined' && obj.error ) {
			user_post.message('quickpost-error-msg',{ show:true, message: obj.error });
		}	else {
  			user_post.message('quickpost-error-msg',{ show:true, message:'An error occurred while trying to save your post.' });
  		}
  		EventManager.fire( 'user_post:save:failed', {json:obj});
  		$('quickpost-error-msg').scrollTo();
    } catch (e) { console.error(e); }
	}

    this.activate_success_message = function(id, username, uri, title) {
        if ($('quickpost-saved')) {
          var bf_uri = 'http://www.buzzfeed.com/'+ username +'/'+ uri;

          $$('#quickpost-saved .fb-like-btn').each(function(el) {
            el.update('<fb:like width="270" height="30" send="true" layout="button_count" href="'+ bf_uri +'" show_faces="false" width="280" font=""></fb:like>');
            try{
            FB.XFBML.parse(el);
            } catch(e){
                console.warn('Cant run FB parse');
            }
          });


          // Facebook Share
          if (Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) < 7) {
            $$('.fb_share').each(function(el) { el.up('.box_btn').remove(); });
          } else {
            $$('#quickpost-saved .fb_share').each( function(el){ el.setAttribute('share_url', bf_uri); });

            if ('hashtrack' in window && 'hash_track' in window ) {
              var hash_tag = hashtrack.hash_tag(bf_uri);
              if ( hash_tag in hash_track ) {
                $$('#quickpost-saved .fb_share').each( function(el){
                  var url = el.getAttribute('share_url');
                  var match = url.match(hashtrack.regex);
                  url = url.replace( hashtrack.regex, '/ht' + match[0] + '/' + hash_tag);
                  el.setAttribute('share_url', url);
                });
              }
            }
            BF_XSS.swift_injection("http://www.facebook.com/connect.php/js/FB.SharePro/");
          }

        if (/submit\/shavetheworld/.test(document.location.href))
        {
          // Twitter
          var tweet_url = "http://tools.awe.sm/tweet-button/files/tweet_button.html?text=@schickxtreme3 " + title + "&url="+ bf_uri +"&count=vertical&related=buzzfeed&awesmapikey=b704dae749db57fc2f52d33dcd7e7fd9a87272da499b8df7361967ed555ad7ec";
          $$('#quickpost-saved .tweet-btn iframe').each(function(el) {el.setAttribute('src', tweet_url);});

        }
        else {
          // Twitter
          var tweet_url = "http://tools.awe.sm/tweet-button/files/tweet_button.html?text=" + title + "&url="+ bf_uri +"&count=vertical&related=buzzfeed&awesmapikey=b704dae749db57fc2f52d33dcd7e7fd9a87272da499b8df7361967ed555ad7ec";
          $$('#quickpost-saved .tweet-btn iframe').each(function(el) {el.setAttribute('src', tweet_url);});

        }


          // StumbleUpon
          $$('#quickpost-saved .su-btn iframe').each(function(el) {el.setAttribute('src', 'http://www.stumbleupon.com/badge/embed/5/?url='+ bf_uri);});

          // Digg
          $$('#quickpost-saved .DiggThisButton').each(function(el) {el.setAttribute('href', 'http://digg.com/submit?url='+ bf_uri +'&title='+ title);});
          var s = document.createElement('SCRIPT'), s1 = document.getElementsByTagName('SCRIPT')[0]; s.type = 'text/javascript'; s.async = true; s.src = 'http://widgets.digg.com/buttons.js'; s1.parentNode.insertBefore(s, s1);

          // Reddit
          $$('#quickpost-saved .reddit-btn iframe').each(function(el) {el.setAttribute('src', 'http://www.reddit.com/static/button/button1.html?width=120&url='+ bf_uri);});

          // Email
          if ($(id+'-email-form')) $$('#quickpost-saved .email-btn').each(function(el) {el.setAttribute('rel:data', "{share_email:{buzz_id:'"+ id +"'}}").show();});
        }
    }

	// clone preview and add it to list of user posts
	this.copy_preview_to_list = function(json) {
		var buzz_type = $('edit-quickpost-form').elements['buzz-type'].value ;
		var obj = user_post.build_post_object(buzz_type);

		// Assign updated quickpost data returned from server
		if ( user_post.buzz.id ) obj.campaignid = user_post.buzz.id;
		if ( user_post.buzz.uri ) obj.uri = user_post.buzz.uri;
		if ( user_post.buzz.thumb ) obj.thumb = user_post.buzz.thumb;

		user_post.preview_from_server(obj, function(r){
			if( !r ) { return; }
			var rObj = eval( '('+r.responseText+')' );
			var html = rObj.snippet;
			html = "<div id='list-of-buzz-preview'><ul class='flow'>" + html + "</ul></div>";
			if ($('contribute-preview-content')) {
				$('contribute-preview-content').update( html );
			}
			user_post._copy_preview_to_list(json)
		});
	}

	this._copy_preview_to_list = function(json) {
		try {
			if ( !$('list-of-buzz') ) return;
			var user = new BF_User();
			var user_info = user.getUserInfo();
			var first_buzz;
			var list_of_buzz = $('list-of-buzz').getElementsByTagName('UL')[1];
			if ( list_of_buzz ) {
				first_buzz = list_of_buzz.firstChild;
			}
			if ( !list_of_buzz ) {
				list_of_buzz = $('list-of-buzz').getElementsByTagName('P')[0];
				list_of_buzz.innerHTML='';
				list_of_buzz.appendChild(document.createElement('div'));
				first_buzz = list_of_buzz.firstChild;
			}
			var quickpostView = $('preview-quickpost').cloneNode(true);
			quickpostView.id = (new Date()).getTime();
			// update url
			var hrefs = quickpostView.getElementsByTagName('A');
			for( var i = 0; i < hrefs.length; i++ ) {
				if ( hrefs[ i ].href.match(/\/#quickpost/) ) {
					hrefs[ i ].href = BF_STATIC.web_root + '/'+user_info.username+'/'+json.uri;
				}
			}
			// update image
			var images = quickpostView.getElementsByTagName('img');
			for( var i = 0; i < images.length; i++ ) {
				if ( images[ i ].src.match(/\/static\/tmp\//) ) {
					images[ i ].src = BF_STATIC.image_root + json.thumb;
				}
			}
			list_of_buzz.insertBefore(quickpostView, first_buzz);
			if (typeof bf_editor != 'undefined') bf_editor.init();
		} catch(e) { console.error(e); }
	}

	this.saved_as_draft_notice = function(json){
		var first_buzz;
		if ($('qp_superlist') || !$('list-of-buzz')) return;
		var list_of_buzz = $('list-of-buzz').getElementsByTagName('UL')[1];
		if ( list_of_buzz ) {
			first_buzz = list_of_buzz.firstChild;
		}
		if ( !list_of_buzz ) {
			list_of_buzz = $('list-of-buzz').getElementsByTagName('P')[0];
			list_of_buzz.innerHTML='';
			list_of_buzz.appendChild(document.createElement('div'));
			first_buzz = list_of_buzz.firstChild;
		}
		var user_info = (new BF_User()).getUserInfo();

		var quickpostView = document.createElement('li');
		var h3 = document.createElement('h3');
		h3.appendChild( document.createTextNode('Your Draft Has Been Saved') );
		var p = document.createElement('p');
		var a = document.createElement('a');
		a.setAttribute('href',BF_STATIC.web_root + '/drafts/' + user_info.username);
		a.appendChild( document.createTextNode( 'your drafts page' ) );
		p.appendChild( document.createTextNode('You can view, edit, and publish draft posts anytime from ') );
		p.appendChild(a);
		p.appendChild( document.createTextNode('.') );

		quickpostView.appendChild( h3 );
		quickpostView.appendChild( p );
		/*
		var terminalLink = document.createElement('a');
		terminalLink.setAttribute('href', BF_STATIC.terminal_root_url+'?action=buzz_edit&bid='+json.id);
		terminalLink.appendChild( document.createTextNode('Terminal') );
		quickpostView.appendChild( document.createTextNode('Go to the ') );
		quickpostView.appendChild( terminalLink );
		quickpostView.appendChild( document.createTextNode(' to make further edits or publish it.') );
		*/
		var draft_count_el = $('draft-count');
		if ( draft_count_el ) {
			var draft_count = draft_count_el.getAttribute('rel:data');
			draft_count = eval('('+draft_count+')');
			draft_count.draft_count++;
			draft_count_el.setAttribute('rel:data', Object.toJSON(draft_count));
			draft_count_el.update(draft_count.draft_count);
			$('get-drafts').show();
		}
		quickpostView.id = (new Date()).getTime();
		quickpostView.className = 'post2 media-buzz link-buzz track saved_as_draft_notice';
		list_of_buzz.insertBefore(quickpostView, first_buzz);
	}

	// Validate form data for specified type
	this.validate = function( type, options ) {
		//console.log('user_post.validate',type,options);
		if (!options) options = {} ;
		var post_structure = user_post.STRUCTURE[type];

		if (typeof post_structure['preprocess'] != 'undefined' ) {
			post_structure.preprocess();
		}
		var mapping = post_structure.form_to_obj_map;
		// Require categorization if user is general_admin
		if ( typeof mapping['quickpost-categorization'] != 'undefined' && $('quickpost-categorization') && acl.user_can('general_admin') ) {
			mapping['quickpost-categorization'].validation = [user_post.VALIDATE.isnt_zero];
			mapping['quickpost-categorization'].label = 'Section';
		}

		var errors = new Array();

		if( options.field ) {

			var error = user_post.validate_field(mapping,options.field);
			if( error ) {
				errors.push(error);
			}
		} else {
			for ( var each in mapping ) {
				if (options.draft) { continue; }
				var error = user_post.validate_field(mapping,each);
				if( error ) {
					errors.push(error);
				}
 			}
 		}

		if ( type == 'embed' && !options.draft ) {
			this.detect_embed_dimensions();
			var embed = $('quickpost-embed-code').value;
			var width = $F('quickpost-embed-width');
			var height = $F('quickpost-embed-height');
			if (! width || parseInt(width) == 0) errors.push({name:'embed',label:'Embed width',element_id:'quickpost-embed-width'});
			if (! height || parseInt(height) == 0) errors.push({name:'embed',label:'Embed height',element_id:'quickpost-embed-height'});
			if ( width && parseInt(width) > 950 ) errors.push( { name:'embed',label:'Embed width cannot exceed 950', element_id:'quickpost-embed-width'} );

			if (errors.length > 0) {
				$('quickpost-embed-dimensions').show();
			}
		}

		return errors;
	}

	// validate one field
	this.validate_field = function(mapping,field,value) {
		var error, current_validator, isValidatorAnObject, current_preprocess;
		var alert = { el_id : field }

		if( typeof mapping[field] != 'undefined' && mapping[field].validation ) {
			value = typeof value != 'undefined' && value !== false ? value : ( $(field).value ? $(field).value : '' );
      if( typeof mapping[field].sub_buzz_type != 'undefined' && mapping[field].sub_buzz_type ) {
        alert.sub_buzz_type = mapping[field].sub_buzz_type;
      }
			if( mapping[field].preprocess ) {
				for ( var i = 0; i < mapping[field].preprocess.length; i++ ) {
					current_preprocess = mapping[field].preprocess[i];
					if( typeof current_preprocess == 'function' ) {
						value = current_preprocess( value );
					}
				}
 			}
			for ( var i = 0; i < mapping[field].validation.length; i++ ) {
				current_validator = mapping[field].validation[i];
				isValidatorAnObject = ( typeof current_validator == 'object' && current_validator['function'] && current_validator['params'] );
				if ( ( isValidatorAnObject && !current_validator['function']( current_validator['params'] ) )
					|| ( typeof current_validator == 'function' && !current_validator( value ) ) ) {
					error =  {
						name      : mapping[field].name ? mapping[field].name : '',
						label     : mapping[field].label,
						element_id: field
					};

					EventManager.fire('superlist_alerts:add', alert);

					break;
				}
			}

			if( !error ) EventManager.fire('superlist_alerts:fix',alert);
		}
		return error;
	}

	// Display validation errors on screen
	this.show_validation_errors = function( type, options ) {
//		console.log('user_post.show_validation_errors', type, options);
		if (!options) options = {} ;
        if (!options.draft) user_post.clear_form_of_errors();
		var displayed_something = true;
		var validation_errors = user_post.validate( type, options );
        var available_to_publish = true;

        if( typeof bf_qp_alerts != 'undefined' ) available_to_publish = bf_qp_alerts.available_to_publish();

		if ( acl.user_can('team_videos') && $('videotab') ) {
			var locked = $('videotab').readAttribute('data-lock');
			if (locked && locked == '1') {
				if (!confirm("Video still uploading. Video data will be lost. Are you sure you want to continue?")) {
					available_to_publish = false;
				}
			}
		}

		if ( validation_errors.length || !available_to_publish ) {
			var msg_labels = new Array();
			for( var i = 0; i < validation_errors.length; i++ ) {
				msg_labels.push(validation_errors[i].label);
			}
		}
		else {
			user_post.message('quickpost-error-msg',{hide:true});
			displayed_something = false;
		}
		return displayed_something;
	}

	// Create data object of specified type from form
	this.build_post_object = function(type) {
		var post_structure = user_post.STRUCTURE[type];
		var obj = {};
		var mapping = post_structure.form_to_obj_map;
		for ( var each in mapping ) {
			if ( $(each) ) {
				if ( $(each).type == 'select' ){
					value = $(each).options[$(each).selectedIndex].value;
				}
				else if ( $(each).type == 'checkbox' ) {
					value = $(each).checked;
					if ( $(each).name=='add_to_vertical_front' ) {
						if ( value ) {
							var ck_acl = ('queue_add_' + $(each).value).toLowerCase();
							if ( acl.user_can(ck_acl) ) value = $(each).value;
							else continue;
						}
						else continue;
					}
				}
				else {
					value = $(each).value;
				}
			}
			if ( mapping[each].preprocess ) {
				for ( var i = 0; i < mapping[each].preprocess.length; i++ ) {
					value = mapping[each].preprocess[i](value);
				}
			}
			obj[mapping[each].name] = value;
		}
		if ( type == 'embed' ) {
			obj.embed_width = $F('quickpost-embed-width');
			obj.embed_height =  $F('quickpost-embed-height');
		}
		obj.add_badges = [];
		obj.remove_badges = [];
		obj.post_type = 'quickpost';
		obj.uri = '#quickpost';
		obj.type = type;
		obj.template = post_structure.template;
		obj.image_root = BF_STATIC.image_root;
		obj.static_root = BF_STATIC.static_root;

		if (typeof superlist != 'undefined' && superlist.get_content_format() == 'breaking') {
			obj.summary_splash = bf_button_group.getValue('breaking_summary_splash') ? Number(bf_button_group.getValue('breaking_summary_splash')) : 0;
			obj.summary_columns = Number(bf_button_group.getValue('breaking_summary_columns'));
		}

		if (typeof superlist != 'undefined' && typeof longform_header != 'undefined' && superlist.get_content_format() == 'long') {
		       try {
		               obj.long_form = Object.toJSON(superlist.longform_header_data());
		       }
		       catch (err) {
		               console.dir(err);
		       }
		}
		if ($('quickpost-titlecase') && $('quickpost-titlecase').checked) {
			obj.title = TT_Filters.titleCase(obj.title);
			if ($('quickpost-title')) $('quickpost-title').value = obj.title;
		}

		return obj;
	}

	// Handle user post-specific stuff when saving an image
	this.save_quickpost_image = function( type, image ) {
		// This is called after save_image()
		BF_UI.closeDialog('user-image-edit');
		BF_UI.closeDialog('super-image-edit');
		switch( type ) {
			case 'link':
			case 'enhanced':
				break;
			case 'image':
				$('quickpost-image-image-width').value = image.width;
				$('quickpost-image-image-height').value = image.height;
				if ( typeof image.image_path == 'undefined' ) {
					$('img-form-preview').hide();
				}
				else {
					$('img-form-preview').src = BF_STATIC.image_root+image.image_path
					$('img-form-preview').show();
				}
				$('image-form-preview').show();
				break;
			case 'video':
				break;
		}
        if (window.bf_qp_sidebar ) {bf_qp_sidebar.checking_required_fields();}
	}

	/**
	 * Assign event handlers
	 */
	this.set_handlers = function() {
		//console.log('user_post.set_handlers')
		var create_user_post_buttons = $$('.post-button');
		for ( var i = 0; i < create_user_post_buttons.length; i++ ) {
			create_user_post_buttons[i].observe('click', this.create_user_post);
		}
		if ($('quickpost-post-button')) $('quickpost-post-button').observe('click', this.save_quickpost );
		if ($('quickpost-save-as-draft-button')) $('quickpost-save-as-draft-button').observe('click', this.save_quickpost_as_draft );
		if ($('quickpost-cancel-button')) $('quickpost-cancel-button').observe('click', this.cancel_quickpost );
		if ($('quickpost-remove-thumb-button')) $('quickpost-remove-thumb-button').observe('click', this.reset_video_thumbnail );
		if ($('quickpost-embed-code')) $('quickpost-embed-code').observe('blur',this.detect_embed_dimensions );
		if ($$('.quickpost-view-draft').length) {
			$$('.quickpost-view-draft').each(function(el){ el.observe('click', user_post.view_draft); });
		}
		if ($$('.supertag')) {
			var supertags = $$('.supertag');
			for (var i = 0; i < supertags.length; i++) {
				supertags[i].observe('click', superlist_special_tags.create_supertags);
			};
		}
		universal_dom.get_bucket_elements('special_tags_list').each(function(el){
			el.observe('change', superlist_special_tags.create_supertags);
		})
		if ($('close-image')) $('close-image').observe( 'click', function(){
			BF_UI.closeDialog('user-image-edit');
		} );

		if($('quickpost-title')){
			// $('quickpost-title').observe('keyup', this._on_quickpost_title_change);
			// $('quickpost-title').observe('blur', this._on_quickpost_title_change);
			$('quickpost-title').observe('blur', this._on_quickpost_title_blur);
		}
		if($('quickpost-url')){
			$('quickpost-url').observe('keydown', this._on_quickpost_url_keydown);
			$('quickpost-url').observe('blur', this._on_quickpost_url_blur);
		}
		new PeriodicalExecuter(function (pe) {
			if(!window.edit_post) return;
			pe.stop();
			EventManager.observe('edit_post:load:done', user_post._on_edit_post_load_done);
		}, 0.5);
		user_post.set_shared_handlers();
	}

	this.set_shared_handlers = function() {
		//console.log('user_post.set_shared_handlers')
		if ($('quickpost-preview-button')) $('quickpost-preview-button').observe('click', this.preview_quickpost );
		if ($('quickpost-video-url'))      $('quickpost-video-url').observe('blur',this.upload_video );
		if ($('image-button'))             $('image-button').observe('click', this.image_handler);
		if ($('embed-image-button'))       $('embed-image-button').observe('click', this.image_handler);
		if ($('link-image-button'))        $('link-image-button').observe('click', this.image_handler);
		if ($('enhanced-image-button'))    $('enhanced-image-button').observe('click', this.image_handler);
		if ($('video-image-button'))       $('video-image-button').observe('click', this.image_handler);
		if ($('quickpost-tags') && window['superlist']) {
			user_post.quickpostTagsTM = null;
			$('quickpost-tags').stopObserving('keydown').stopObserving('keyup').stopObserving('focus').stopObserving('blur');
			$('quickpost-tags').observe('keydown',superlist_special_tags.auto_complete_special);
			$('quickpost-tags').observe('keyup',function(e){
				if (user_post.quickpostTagsTM != null) clearTimeout(user_post.quickpostTagsTM);
				user_post.update_primary_keyword(e.target.value,false);
				superlist_special_tags.special_tags_warning(e.target.value);
				user_post.duplicate_tags_warning(e.target.value);
				user_post.quickpostTagsTM = setTimeout(function(){
					user_post.auto_complete(e);
					user_post.quickpostTagsTM = null;
				}, 400);
			});
			$('quickpost-tags').observe('focus',function(){
				$('tag_suggestions').show()
			});
			$('quickpost-tags').observe('blur',function(e){
				user_post.update_primary_keyword(e.target.value, false);
				superlist_special_tags.special_tags_warning(e.target.value);
				user_post.duplicate_tags_warning(e.target.value);
				window.setTimeout(function(){
					if (user_post.quickpostTagsTM != null) clearTimeout(user_post.quickpostTagsTM);
					$('tag_suggestions').hide();
				},200)
			});
		}
		if ( typeof(localStorage) != 'undefined' ) { try {
			var cache = localStorage.getItem( "user_post.__auto_complete" );
			if ( cache ) user_post.__auto_complete = cache.evalJSON();
		} catch (e) { console.log(e); } }
	}

	this.edit_primary_keyword = function(obj) {
		//console.log('user_post.edit_primary_keyword')
		var action = 'save';
		var newText = 'edit';
		var primary_keyword_text = '';
		// Determine action based on text of element in primary_keyword_toggle element
		universal_dom.get_bucket_elements('primary_keyword_toggle').each( function(el){
			if ( el.textContent == 'edit') {
				action = 'edit';
				newText = 'save';
			}
			el.textContent = newText;
		});
		// Toggle primary_keyword bucket elements on/off; note text of input field in case we need to save it
		universal_dom.get_bucket_elements('primary_keyword').each( function(el){
			if ( el.hasClassName('hidden') ) el.removeClassName('hidden');
			else el.addClassName('hidden');
			if ( el.tagName.toLowerCase() == 'input' ) primary_keyword_text = el.value.trim();
		});
		// Once the editor specifies a primary kewyord, no longer update it based on regular keyword
		if ( action == 'save' ) {
			//remove first keyword since it's a primary keyword now
			if ( !user_post.primary_keyword_locked ) {
				var v = $('quickpost-tags' ).value;
				v = v.substr( v.indexOf(',') + 1 ).trim();
				$('quickpost-tags' ).value = v;
			}
			//check for empty pk
			if (primary_keyword_text == '')
			//lock and update pk caption
			user_post.primary_keyword_locked = true;
			user_post.update_primary_keyword(primary_keyword_text, true);
			user_post.duplicate_tags_warning($('quickpost-tags').value);
		} else $('quickpost-primary_keyword' ).focus();
	}

	this.change_published_url = function(obj) {
		if (!acl.user_can('change_published_url') || edit_post.buzz.status != 'live') return;
		var edit_label   = 'edit URL';
		var cancel_label = 'cancel';
		var action       = edit_label;
		var newAction    = cancel_label;
		if ( $('published_url_toggle').innerHTML === cancel_label ) {
			action    = cancel_label;
			newAction = edit_label;
			$('quickpost-url').value = edit_post.buzz.uri;
		}
		user_post.set_words_in_url_editable( action === edit_label );
		$('change_published_url').value = action === edit_label ? 1 : 0;
		$('published_url_toggle').innerHTML = newAction;
	}

	this.edit_primary_keyword_keydown = function(e) {
		if ( e.keyCode == Event.KEY_RETURN ) {
			user_post.edit_primary_keyword();
			e.cancelBubble = true;
			e.returnValue = false;
			if (e.stopPropagation) {
				e.stopPropagation();
				e.preventDefault();
			}
			return false;
		}
	}

	this.update_primary_keyword = function(str, ignore_lock) {
		//console.log('user_post.update_primary_keyword', user_post.primary_keyword_locked)
		if ( user_post.primary_keyword_locked && !ignore_lock) return;
		// Get first keyword (phrase, actually) from string; remove surrounding whitespace
		var value = '';
		if ( str.length > 0 ) {
			var terms = str.split(',');
			value = terms[0].trim();
		}
		// Update values for all elements in primary_keyword buckets
		universal_dom.get_bucket_elements('primary_keyword').each( function(el){
			if ( el.tagName.toLowerCase() == 'span' ) {
				el.update(value);
			}
			else {
				el.value = value;
			}
		});
	}

	//update primary_keyword, and remove it from tags
	this.sync_tags_with_primary_keyword = function(t, pk) {
		//console.log('user_post.sync_tags_with_primary_keyword', t, pk);
		if (pk) {
			pk = pk.trim();
			user_post.update_primary_keyword(pk);
			if ( pk.length > 0 ) {
				user_post.primary_keyword_locked = true;
			}
		}
		if (t) {
			var tags = t.split(',');
			var ok_tags = new Array();
			tags.each( function(t){
				t = t.trim();
				if ( pk && t == pk ) return;
				if ( ok_tags.indexOf(t) == -1 ) ok_tags.push(t);
			});
			t = ok_tags.join(',');
		}
		var duplicate_elements = universal_dom.get_bucket_elements('duplicate_tags_warning');
		duplicate_elements.each(function(el){ el.addClassName('hidden'); });
		return t;
	}

	this.set_words_in_url_editable = function(editable) {
		var selector = $('quickpost-url');
		if ( !selector ) return false;
		if(editable) {
			$('words_in_url_label').setStyle({ color: 'rgba(50, 50, 50, 1.0)' });
			selector.enable();
			this.URI.enabled = true;
		} else {
			$('words_in_url_label').setStyle({ color: 'rgba(50, 50, 50, 0.3)' });
			if (acl.user_can('change_published_url') && edit_post.buzz.status == 'live') {
				$('published_url_toggle').style.display = 'inline-block';
			}
			selector.disable();
			this.URI.enabled = false;
		}
	};

	this.clean_for_url_failsafe = function(s, callback) {
		s = net.kornr.unicode.lowercase_nomark(s);
		s = s.replace(/_/g, '-');
		s = s.replace(/&.*?;/g, '');
		var uri_tokens = s.replace(/&.*?;/g, '').match(/[a-zA-Z0-9\s\-]+/g);
		var uri = '';
		if (uri_tokens) {
			uri = uri_tokens.join('');
			uri = uri.replace(/\s+/g, '-');
			uri = uri.replace(/\-+/g, '-');
			uri = uri.replace(/^\-|\-$/g, '');
			uri = uri.toLowerCase();
			uri = uri || '-';
			uri = uri.substr(0, this.URI.max_length);
		}
		if (callback) callback(uri, params);
	};

	this.clean_for_url = function(s, params, callback) {
		if (s.trim().length == 0) {
			if (callback) callback(s, params);
		}
		else {
			try {
				var ajax = new BF_Request();
				ajax.request('/buzzfeed/api/textprocessing/sanitizeuri', {
					method			: 'post',
					parameters	: { text:s },
					onSuccess		: function(resp) {
						resp = resp.responseText.evalJSON();
						if ( typeof resp.text != 'undefined' ) {
							callback(resp.text, params);
						}
						else {
							clean_for_url_failsafe(s, callback);
						}
					},
					onFailure		: function(resp) {
						clean_for_url_failsafe(s, callback);
					},
					async				: false
				});
			} catch(e) { console.error(e); }
		}
	};

	this.duplicate_tags_warning = function(str) {
		//console.log('user_post.duplicate_tags_warning')
		if ( typeof universal_dom != 'undefined' && str ) {
			var a = str.split(',');
			a = a.map(function(el){return el.trim()});
			//if pk is locked, then we assume that it's not the same as first keyword anymore and so should be checked too
			if (user_post.primary_keyword_locked) a.push(universal_dom.get_bucket_elements('primary_keyword')[0].textContent.trim());
			var duplicate_elements = universal_dom.get_bucket_elements('duplicate_tags_warning');
			if ( a.length != a.uniq().length ) {
				duplicate_elements.each(function(el){ el.removeClassName('hidden'); });
			} else {
				duplicate_elements.each(function(el){ el.addClassName('hidden'); });
			}
		}
	}

	this.detect_embed_dimensions = function (e) {

		var embed = $F('quickpost-embed-code');
		var width = false;
		var height = false;
		if (!embed.match(/<script/i) && embed.match(/<(embed|object|iframe)/i))
		{
			width = embed.match(/<(embed|object|iframe)\s+[^>]*width\s*=\s*.(\d+)/i);
			height = embed.match(/<(embed|object|iframe)\s+[^>]*height\s*=\s*.(\d+)/i);
			if (width && $F('quickpost-embed-width') == 0)
			{
				$('quickpost-embed-width').value = width[2];
			}

			if (height && $F('quickpost-embed-height') == 0)
			{
				$('quickpost-embed-height').value = height[2];
			}

		}

		if (!width || !height)
		{
			$('quickpost-embed-dimensions').show();
		}

	}

	/* Event handlers */
	this._on_edit_post_load_done = function(obj) {
		user_post.clean_for_url(obj.buzz.name, obj, function(text, obj) {
			user_post.URI.words = text;
			user_post.URI.buff = user_post.URI.words;
			user_post.URI.editing = user_post.URI.buff != obj.buzz.uri;
			user_post.set_words_in_url_editable( obj.buzz.status == 'draft' );
		});
	};

	this._on_quickpost_url_keydown = function(evt) {
		user_post.URI.buff = this.value;
	};

	this._on_quickpost_url_blur = function(evt) {
		$('quickpost-url').removeClassName('uri-spinner');
		$('quickpost-url').addClassName('uri-spinner');
		user_post.URI.editing = !!this.value && user_post.URI.buff != this.value;
		if(!this.value) {
			user_post.clean_for_url($('quickpost-title').value, evt, function(text, evt) {
				user_post.URI.words = text;
				user_post.URI.buff = user_post.URI.words;

				if(user_post.URI.enabled) {
					this.value = user_post.URI.words;
					if ($('quickpost-url')) $('quickpost-url').value = user_post.URI.words;
				}
				$('quickpost-url').removeClassName('uri-spinner');
			});
		} else if(user_post.URI.editing) {
			user_post.clean_for_url(this.value, evt, function(text, evt) {
				user_post.URI.words = text;
				user_post.URI.buff = user_post.URI.words;

				if(user_post.URI.enabled) {
					this.value = user_post.URI.words;
					if ($('quickpost-url')) $('quickpost-url').value = user_post.URI.words;
				}
				$('quickpost-url').removeClassName('uri-spinner');
			});
		}
	};

	this._on_quickpost_title_blur = function(evt) {
		$('quickpost-url').removeClassName('uri-spinner');
		$('quickpost-url').addClassName('uri-spinner');
		user_post.clean_for_url(this.value, evt, function(text, evt) {
			user_post.URI.words = text;
			if( user_post.URI.enabled && !user_post.URI.editing ) {
				user_post.URI.buff = user_post.URI.words;
				if ($('quickpost-url')) $('quickpost-url').value = user_post.URI.words;
			}
			$('quickpost-url').removeClassName('uri-spinner');
		});
	};

	// get tag suggestions unless query term already is cached
	this._auto_complete_term = function(value) {
		//console.log('user_post._auto_complete_term')
		var terms = value.split(',');
		query = terms.pop();
		query = query.replace(/^\s*/,'');
		query = query.replace(/\s*$/,'');
		return query;
	}

	this._find_element = function( idx ) {
		if ( idx < 0 || idx > user_post.__auto_complete_elements.length ) return null;
		var el = null;
		for( var i = 0; i < user_post.__auto_complete_elements.length; i++ ) {
			if( user_post.__auto_complete_elements[i].getAttribute('rel:idx') == idx ) {
				el = user_post.__auto_complete_elements[i];
				break;
			}
		}
		return el;
	}

	this._handle_special_keys = function( key_code ) {
		//console.log('user_post._handle_special_keys')
		// enter key (Event.KEY_RETURN): add highlighted suggested keyword to keywords
		// escape key (27) : hide suggested keywords
		// arrow up (Event.KEY_UP): highlight higher keyword
		// arrow down (Event.KEY_DOWN): highlight lower keyword
		this.select_it = function(){
			var el = user_post._find_element( user_post.__auto_complete_idx );
			if ( el ) user_post.auto_complete_select({stop:function(){},target:el});
			$('tag_suggestions').hide();
		}
		if ( key_code == Event.KEY_RETURN ) {
			this.select_it();
		}
		else if ( key_code == Event.KEY_UP ) {
			var el = user_post._find_element( parseInt( user_post.__auto_complete_idx ) - 1 );
			if ( el ) user_post.auto_complete_hover({stop:function(){},target:el});
		}
		else if ( key_code == Event.KEY_DOWN ) {
			var el = user_post._find_element( parseInt( user_post.__auto_complete_idx ) + 1 );
			if ( el ) user_post.auto_complete_hover({stop:function(){},target:el});
		}
		else if ( key_code == 27 ) {
			$('tag_suggestions').hide();
		}
		else if ( key_code == 9 ) {
			this.select_it();
		}
	}

	this.auto_complete = function(e) {
		//console.log('user_post.auto_complete')
		var keyCode = e.keyCode;
		if ( keyCode == 9 || keyCode == Event.KEY_RETURN || keyCode == Event.KEY_UP || keyCode == Event.KEY_DOWN || keyCode == 27 ) {
			if (keyCode != 9) e.stop();
		} else {
			$('tag_suggestions-spinner').show();
			$('tag_suggestions').update('');
			$('tag_suggestions').show();
			var query = user_post._auto_complete_term(e.target.value);
			if ( query.length > 0 ) {
				if ( typeof user_post.__auto_complete[query] == 'undefined' ) {
					var ajax = new BF_Request();
					ajax.request('/buzzfeed/_public_tag_autocomplete', {
						method:'get',
						parameters:{query:query},
						onSuccess: user_post._auto_complete_success,
						onFailure: function(resp){ajax.alert('Error contacting server');},
						bf_auth: true
					});
				}
			}
			else {
				$('tag_suggestions-spinner').hide();
			}
			// poll tag completion cache periodically until update is available
			user_post._auto_complete_update();
		}
	}

	// add results to tag completion cache
	this._auto_complete_success = function(r) {
		//console.log('user_post._auto_complete_success')
		if ( r.status == 200 ) {
			user_post.__auto_complete[r.request.options.parameters.query] = r.responseText;
			if ( typeof(localStorage) != 'undefined' ) {
				localStorage.setItem("user_post.__auto_complete", Object.toJSON(user_post.__auto_complete));
			}
		}
		else {
			$('tag_suggestions-spinner').hide();
		}
	}

	// update field with value from cache; recheck periodically if value is not available
	this._auto_complete_update = function() {
		//console.log('user_post._auto_complete_update')
		var query = user_post._auto_complete_term($('quickpost-tags').value);
		if ( query.length > 0 ) {
			if ( typeof user_post.__auto_complete[query] != 'undefined' ) {
				$('tag_suggestions-spinner').hide();
				$('tag_suggestions').update( user_post.__auto_complete[query] );
				user_post.__auto_complete_elements = [];
				var terms = $('tag_suggestions').getElementsByTagName('LI');
				for( var i = 0; i < terms.length; i++ ) {
					$(terms[i]).setAttribute( 'rel:idx', i );
					$(terms[i]).observe('mouseover',user_post.auto_complete_hover);
					$(terms[i]).observe('mouseout',user_post.auto_complete_unhover);
					$(terms[i]).observe('click',user_post.auto_complete_select);
					user_post.__auto_complete_elements.push( $(terms[i]) );
				}
				user_post.__auto_complete_idx = 0;
				var el = user_post._find_element( parseInt( user_post.__auto_complete_idx ) );
				if ( el ) user_post.auto_complete_hover({stop:function(){},target:el});
			}
			else {
				window.setTimeout(user_post._auto_complete_update,200);
			}
		}
	}

	this.auto_complete_unhover = function( e ) {
		//console.log('user_post.auto_complete_unhover')
		e.stop();
		e.target.removeClassName( 'selected' );
	}

	this.auto_complete_hover = function( e ) {
		//console.log('user_post.auto_complete_hover')
		e.stop();
		var el = user_post._find_element( parseInt( user_post.__auto_complete_idx ) );
		if ( el ) user_post.auto_complete_unhover({stop:function(){},target:el});
		user_post.__auto_complete_idx = e.target.getAttribute( 'rel:idx' );
		e.target.addClassName( 'selected' );
	}

	this.auto_complete_select = function( e ) {
		//console.log('user_post.auto_complete_select')
		e.stop();
		var value = e.target.innerHTML;
		var field_value = $('quickpost-tags').value;
		var terms = field_value.split(',');
		var existing_terms = {};
		terms.pop();
		for( var i = 0; i < terms.length; i++ ) {
			terms[i] = terms[i].replace(/^\s*/,'');
			terms[i] = terms[i].replace(/\s*$/,'');
			existing_terms[ terms[i] ] = true;
		}
		value = value.replace( /^\s*/,'' );
		value = value.replace( /\s*$/,'' );
		if ( typeof existing_terms[ value ] == 'undefined' ) terms.push(value);
		$('quickpost-tags').value = terms.join(', ') ;
		$('quickpost-tags').focus();
	}

	this.image_handler = function(e) {
		e.stop();
		window.default_image_handler = 'user_setting';
		user_post.image_element_clicked = e.target;
		$('user-image-edit-iframe').src="/static/images/public/spinners/big_on_eee.gif";
		if ($('image-preview-div')) $('image-preview-div').show();
		if ($('user-loading')) $('user-loading').show();
		BF_UI.showDialog('user-image-edit');
		$('image-preview').hide();
		// if(Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6) {
		// 	var offsets = document.viewport.getScrollOffsets();
		// 	var vheight = document.viewport.getHeight();
		// 	var top = vheight / 2 + offsets.top;
		// 	$('user-image-edit').setStyle({top: top});
		// }
		$('user-image-edit-iframe').src="/buzzfeed/_edit_user_contribution_image?action=imageform&template=public/user/quickpost_imageform.tt";
		var buzz_type = 'link';
		if ( e.target.id == 'image-button' ) buzz_type = 'image';
		else if ( e.target.id == 'video-image-button' ) buzz_type = 'video';
		$('user-image-edit-iframe').observe('load',	function(ev){
			if (typeof ev.target.contentWindow.user_image != 'undefined')
				ev.target.contentWindow.user_image.setBuzzType(buzz_type);
		});
		if ($('video-form-preview')) $('video-form-preview').hide();
	};

	// Store video to detect if video src changes
	this.embed_link = '';

	/**
	 * Processes user entered video url.  Called when video url
	 * text input box loses focus
	 *
	 * @param event 	Passed from observer
	 */
	this.upload_video = function( e ) {
		e.stop();
		user_post.message('quickpost-video-thumb-msg', {show:false, message:''});
		var thumbnail_display='block';
		var video = new bf2_terminal_Video();
		video.detect_type(e.target.value.toString());

		// Video hasn't changed, do nothing
		//if( user_post.current_video_src == video.src_link )
		if (user_post.embed_link == video.embed_link) return false;
		$$('#quickpost-video p.video_privacy_warning').each(function(el) {el.hide();});

		// Supported video type
		if (video.type) {

			$('quickpost-video-ok').value='true';
			user_post.set_video_thumbnail( video );

			// No video, hide thumbnail
			if (e.target.value.toString().length == 0) thumbnail_display = "none";

			// Store video url for later comparison
			user_post.embed_link = video.embed_link;

			$('quickpost-video-thumb').style.display = thumbnail_display;
			if (!!video.possible_privacy_restrictions) $$('#quickpost-video p.video_privacy_warning').each(function(el) {el.show();});

			var so = BF_initSwfObject( video.src_link, { width: 280, height: 202 } );
			if (!so) return;

			so.write( "video-form-preview" );
			user_post.message('quickpost-video-thumb-msg',{hide:true});
			$('video-form-preview').show();
			e.target.value = video.src_link;

		// Unsupported video type
		} else {
			// Don't remove uploaded thumbnail automatically
			if (user_post.is_video_thumbnail_uploaded()) user_post.remove_video_thumbnail( video );

			$('quickpost-video-ok').value='false';
			$('video-form-preview').hide();
			user_post.message('quickpost-video-thumb-msg',{ show:true, message:'Sorry, that doesn\'t seem to be a supported video type' });
		}
	}

	/**
	 * Sets and shows automatically retrieved thumbnail if available
	 *
	 * @param video 	bf2_terminal_Video() object from Video.js
	 */
	this.set_video_thumbnail = function( video ) {

		if( ! video )
			return false;

		// Don't replace uploaded thumbnail
		if( user_post.is_video_thumbnail_uploaded() )
			return false;

		if( ! video.thumbnail_available )
			return false;

		// Get thumbnail url requires ajax call and callback handler
		video.detect_thumbnail_url( function() {
			$('quickpost-video-image-file').value = this.thumbs[0];
			$('video-link-thumbnail').src = this.thumbs[0];
			$('video-link-thumbnail').show();
		} );

	};

	/**
	 * Report whether current video thumbnail was uploaded manually
	 *
	 * @return 	true or false
	 */
	this.is_video_thumbnail_uploaded = function() {
		var thumbnail_url = ($('video-link-thumbnail') && $('video-link-thumbnail').getAttribute("src")) ? $('video-link-thumbnail').getAttribute( "src" ) : "";
		var result = false;

		// Don't replace uploaded thumbnail
		if ( !$('video-link-thumbnail') )
			result = true;
		else if ( thumbnail_url.match(/s3.amazonaws.com/) || thumbnail_url.match(/http:\/\/.*\.(buzzfeed|buzzfed)\.com\/static/) || thumbnail_url.substr( 0, 7 ) == "/static" )
			result = true;

		//console.warn(result);
		return result;
	}

	/**
	 * Reset uploaded video thumbnail so it can be auto-set again
	 */
	this.reset_video_thumbnail = function() {
		$('video-link-thumbnail').src = "";

		// set_video_thumbnail requires video object
		var video = new bf2_terminal_Video();
		var video_url = $('quickpost-video-url').value.toString();

		video.detect_type( video_url );
		user_post.set_video_thumbnail( video );

		// Hide element that calls this method
		$("quickpost-remove-thumb-button").hide();

	};

	/**
	 * Remove video thumbnail from DOM
	 */
	this.remove_video_thumbnail = function() {
		$('quickpost-video-image-file').value = "";
		$('video-link-thumbnail').src = "";
		$('video-link-thumbnail').hide();
	};

	/**
	 * Fires native event, because prototype can't be bothered.
	 * Seriously.  Why does prototype still exist? Is it 2001 still?
	 *
	 * @param el 	DOM element
	 * @param ev 	Event to fire
	 */
	this.fire_native_event = function( el, ev ) {
		if( document.createEvent ) {
        var evt = document.createEvent( "HTMLEvents" );
        evt.initEvent( ev, true, true );
        el.dispatchEvent( evt );
		}
		else {
			// IE
			el.fireEvent( "on" + document.createEventObject() );
		}
	}


	this.view_draft = function(e) {
		//console.log('user_post.view_draft');
		if (typeof edit_post != 'undefined') return true;
		else {
			//TODO: should be refactored and moved into qp_superlist.save_post(or something) once 46806033 with those changes in develop
			if (!superlist.is_dirty_module(e, 'previewing')) {
				user_post.save_quickpost_as_draft(e);
				new PeriodicalExecuter(function (pe) {
					//if buzz saved and edit_post loaded
					if ( typeof edit_post != 'undefined' ) {
						pe.stop();
						edit_post.view_draft(e);
					}
					//if we had error upon saving
					else if ( $('quickpost-error-msg').visible() ) pe.stop();
				}, 0.5);
			} else {
				superlist.save_var = e;
				superlist.auto_save = true;
				superlist.save_current_item(e);
				new PeriodicalExecuter(function (pe) {
					//if buzz saved and edit_post loaded
					if ( typeof edit_post != 'undefined' ) {
						pe.stop();
						EventManager.observe('edit_post:save:done', function(e, pe){
							edit_post.view_draft(e);
						}.bind(this, e, pe));
					}
					//if we had error upon saving
					else if ( $('quickpost-error-msg').visible() ) pe.stop();
				}, 0.5);
			}
		}
	}

	this.preview_quickpost = function(e) {
		try {
			e.stop();
			user_post.clear_form_of_errors();
			var buzz_type = e.target.form.elements['buzz-type'].value ;
			if ( !user_post.show_validation_errors( buzz_type ) ) {
				var obj = user_post.build_post_object(buzz_type);
				obj.preview_raw = e.preview_raw;
				if ($F('buzz_id')) obj.live_id = $F('buzz_id');
				user_post.preview_from_server(obj, user_post.preview_from_server_ok);
			}
		} catch(e) { console.error(e); }
	}

	this.queue_quickpost = function(data) {
		//console.log('user_post.queue_quickpost')
		try {
			user_post.clear_form_of_errors();
			var buzz_id = data.id;
			var category_id = parseInt(data.categorization);
			var category_index = $('quickpost-categorization').selectedIndex;
			var category_name = $('quickpost-categorization')[category_index].text;
			var is_vertical = false;
			var action_id = (typeof data.f_index != "undefined" && data.f_index == 1) ? 2 : 1;
			if(typeof data.queue_and_publish != "undefined" && data.queue_and_publish == 1){
				is_vertical = false;
			}else if(this.is_vertical(category_id)){
				is_vertical = true;
				action_id = category_id;
			}else if((typeof data.categorization === 'undefined') && this.is_vertical(category_index)){
				is_vertical = true;
				action_id = category_index;
			}
			var queue_btn = $('quickpost-queue-super');
			var params = {
				buzz_id: buzz_id,
				action_id: action_id,
				target: queue_btn
			};
			if ( is_vertical == true ) params['vertical_name'] = category_name;
			var isIndexOrSuggest = (( typeof data.f_index != 'undefined' && data.f_index == 1 ) || ( typeof data.fq_suggest != 'undefined' && data.fq_suggest == 1 ));
			if ( isIndexOrSuggest ) params.add_to_homepage = 1;
			queue.global_queue_handlers();
			queue.update_queue_time(params);
		} catch(e) { console.error(e); }
	}

	this.is_vertical = function(cat_id) {
		for ( var i = 0; i < this.vertical_categories.length; i++ ) {
			if( this.vertical_categories[i] == cat_id ) {
				return true;
			}
		}
		return false;
	}

	this.delete_quickpost = function(e) {
		e.stop();
		var id = e.target.getAttribute('rel:id');
		if ( id ) user_post._delete_quickpost(id);
	}

	this._delete_quickpost = function(id) {
		var data = {
			action:'delete',
			id:id
		}
		var ajax = new BF_Request();
		ajax.request('/buzzfeed/_public_admin', {
			method:'post',
			needsToken:true,
			parameters:data,
			onSuccess: function(resp){
				//edit_post.save_ok(resp, data)
			},
			onFailure: function(resp){
				user_post.save_failed(resp);
			}, bf_auth: true
		});
	}

	this.save_quickpost_as_draft = function(e) {
		//console.log('user_post.save_quickpost_as_draft')
		if (e) e.stop();
		var type = $F('buzz-type');
		var post_structure = user_post.STRUCTURE[type];
		if (typeof(post_structure['preprocess']) != 'undefined') post_structure.preprocess('draft');
		if (typeof(user_post.enhanced_js) != 'undefined') $('quickpost-enhanced-data').value = user_post.enhanced_js.as_string();
		user_post.save_quickpost(e, {save_as_draft:true});
	}

	this.save_quickpost = function(e, params, sl) {
		//console.log('user_post.save_quickpost')
		if (e) e.stop();
		if ( typeof params == 'undefined' ) params = {};
		user_post.save_as_draft = params.save_as_draft ? params.save_as_draft : false;
		if (!!sl || $('buzz-type')) {
			var buzz_type = $('buzz-type').getValue();
		} else {
			var buzz_type = (e.target.form.element['buzz-type'] ? e.target.form.elements['buzz-type'].value : null);
		}

        superlist.add_tmp_title();

		if ( !user_post.show_validation_errors( buzz_type, {draft:user_post.save_as_draft} ) ) {
			EventManager.fire('videotab:save:preparing', {});
			var obj = user_post.build_post_object(buzz_type);
			var user = new BF_User();
			if (!acl.user_can('general_admin')) {
				delete obj.categorization ;
				delete obj.tags ;
				delete obj.tame ;
				delete obj.additional_bylines ;
			}
			obj.draft_public = 0;
			if ($('quickpost-public-draft') && $('quickpost-public-draft').checked) {
				obj.draft_public = 1;
			}
			user_post.preview_from_server(obj, function(r){
				user_post.preview_from_server_and_save(r,obj);
			});
		} else {
			EventManager.fire( 'user_post:save:failed', {});

			// Log to GA
			gtrack.track_events('[ttp]:post-settings', 'publish-now', 'alert');
		}
	}

	this.cancel_quickpost = function(e) {
		e.stop();
		$('contribute-preview').hide();
		$('user-edit-quickpost').hide();
		$('select-quickpost-box').show();
		user_post.reset_post_form();
		user_post.show_video_preview = false;
		EventManager.fire( 'user_post:cancel', {});
	}

	this.do_create_user_post = function(e) {
		if ($('user_post_preview_iframe')) {
			$('close-preview').observe('click',function(e){$('user_post_preview').hide()});
			$('user_post_preview_iframe').src='/static/html/quickpost_preview.html?cb='+(new Date()).getTime();
		}
		var target = (e.target.id ? e.target.id : (e.target.parentNode && e.target.parentNode.id ? e.target.parentNode.id : null));
		var buzz_type = user_post.ID_TO_TYPE_MAP[target];
		var post_structure = user_post.STRUCTURE[buzz_type];
		user_post.trigger_element = target;

		if (!'multiboost' in window) $('select-quickpost-box').hide();
		$('quickpost-saved').hide();
		user_post.show_user_post_form( buzz_type );
		EventManager.fire( 'user_post:create:opening_form', {buzz_type:buzz_type,post_structure:post_structure});
	}

	this.create_user_post = function(e) {
		e.stop();
		bfjemplate.load_if_missing({
			id: "user_post_preview",
			callback: user_post.do_create_user_post,
			context: user_post,
			args: arguments
		});
	}

	this.tweet_buzz = function(tweet_info) {
		if (tweet_info) {
			return 1;
		} else if ($F('buzz_id')) {
			superlist.toggle_disable_actions();
			var params = {
				action: 'check',
				buzz_id: $F('buzz_id')
			};
			new Ajax.Request("/buzzfeed/_tweet_info", {
				method: 'post',
				parameters: params,
				onSuccess: function (o) {
					superlist.toggle_disable_actions();
					var resp = o.responseText.evalJSON();
					// if (!resp.present) {
						EventManager.observe( 'user_post:close:astweet_info', superlist_special_tags.remove_special_tag);
						twitter.open_astweet_info();
					// }
				},
				onError: function(o) {
					if ( !! superlist.disable_actions) superlist.toggle_disable_actions();
				},
				onFailure: function(o) {
					if ( !! superlist.disable_actions) superlist.toggle_disable_actions();
				}
			});
			return 1;
		} else if (typeof edit_post !== 'undefined' && (edit_post.getParameter('id') || edit_post.campaignid)) {
			return 1;
		} else {
			alert("Firstly save a buzz!");
		}
		return 0;
	}

	this.save_tweet_info = function(obj) {
		var tweet_info = obj;
		var params = {
				action: 'save',
				buzz_id: $F('buzz_id'),
				data: Object.toJSON(tweet_info)
			};
		new Ajax.Request("/buzzfeed/_tweet_info", {
				method: 'post',
				parameters: params,
				onSuccess: function (o) {
					var resp = o.responseText.evalJSON();
					if ($('showpromoastweet')) $('showpromoastweet').update(user_post.show_tweet_info(obj));
					universal_dom._bucket['special_tag'].elements.each( function(obj){
						if ( obj.data.id == 'showpromoastweet' ) obj.data.tweet_info = tweet_info;
					});
					EventManager.fire('superlist:astweet_info_processed', {});
				}
			});
	}

	this.show_tweet_info = function(obj) {
		return '<strong>Tweet Info:</strong><p>ID: ' + obj.id_str
				+ '</p><p>From User: '               + obj.from_user
				+ '</p><p>Status: '                  + obj.text
				+ '</p><p>Created At: '              + obj.created_at
				+ '</p><a href="javascript:;" onclick="twitter.open_astweet_info()">Change Tweet</a>';
	}

	this.load_community_info = function(obj,data){
		// To avoid banging the server with multiple requests for the same info,
		// set a flag when the request is in progress, and cache the result when it returns;
		// Implementation first checks the cache and only hits the server if there's nothing there.
		if ( !(new BF_User()).isLoggedIn() ) return;
		if ( user_post.lock_load_community_info ) {
			return setTimeout(function(){user_post.load_community_info(obj,data)},250);
		}
		user_post.lock_load_community_info = true;
		var success = function(r){
			var o = eval( '(' + r.responseText + ')' );
			o.pluralize_community_suggestions_per_day = o.community_suggestions_per_day == 1 ? '' : 's';
			o.pluralize_community_suggestions_remaining = o.community_suggestions_remaining == 1 ? '' : 's';

                       universal_dom._bucket['recent_sensitive_tags'] = {
                                elements : [],
                                uptodate : 0
                        };
                        if (o.recent_sensitive_tags) {
                                o.recent_sensitive_tags.each(function(tag) {
                                        universal_dom._bucket['recent_sensitive_tags'].elements.push(tag);
                		});
                                universal_dom._bucket['recent_sensitive_tags'].uptodate = 1;
                        }
                        if ( o.success && data.element && typeof o[data.value] != 'undefined' && o.display_for_user == 1 && (typeof superlist.submit_to_username == 'undefined' || superlist.submit_to_username == '') ) {
				var show_bucket = 'display_if_in_community';
				if ( o.community_tier == 0 ) show_bucket = 'display_if_not_in_community';
				if ( o.community_tier == -1 ) show_bucket = 'display_if_banned';
				universal_dom.get_bucket_elements(show_bucket).each( function(el){
					el.removeClassName('hidden');
				});
				if ( o.community_tier > -1 ) show_bucket = 'display_unless_banned';
				universal_dom.get_bucket_elements(show_bucket).each( function(el){
					el.removeClassName('hidden');
				});

				data.element.update(o[data.value]);
				show_bucket = 'display_if_no_community_suggestions_remain';

				if ( o.community_suggestions_remaining > 0 ) show_bucket='display_if_community_suggestions_remain';
				universal_dom.get_bucket_elements(show_bucket).each( function(el){
					el.removeClassName('hidden');
				});
				if ( o.community_suggestions_remaining > 0 ) {
					var show_bucket='display_if_many_community_suggestions_remain';
					if ( o.community_suggestions_remaining == 1 ) show_bucket='display_if_one_community_suggestion_remains';
					universal_dom.get_bucket_elements(show_bucket).each( function(el){
						el.removeClassName('hidden');
					});
				}

				// Whether or not we ultimately show the community UI depends on whether this post is published or not;
				// at this point, we know the user has permission to see the community box, but if we're editing
				// the post it might not have loaded yet. So ... if there's no edit_post object on the page, we know
				// we're not editing, so show the UI. If there is an edit_post object, listen for when the data is
				// loaded. Once loaded, if the status is anything other than live, show the community box.
				// Since we can't be sure when edit_post will load, especially on stage/prod, we'll also check
				// to see if the edit_post.buzz data has already loaded... probably won't have, though.
				var showUI = function(){
					if ( typeof edit_post == 'undefined' ) {
						universal_dom.get_bucket_elements('community_info_loaded').each(function(el){
							el.removeClassName('hidden');
						});
					}
					else if ( typeof edit_post == 'object' && typeof edit_post.buzz == 'object' && edit_post.buzz.status != 'live' ) {
						universal_dom.get_bucket_elements('community_info_loaded').each(function(el){
							el.removeClassName('hidden');
						});
					}
					else {
						EventManager.observe('edit_post:load:done', function(data){
							if ( data.buzz.status != 'live' ) {
								universal_dom.get_bucket_elements('community_info_loaded').each(function(el){
									el.removeClassName('hidden');
								});
							}
						})
					}
					bf_qp_sidebar.validate_page_content_height();
				}
				setTimeout(showUI,250);
			}
			user_post.lock_load_community_info = false;
		};
		if ( typeof user_post.loaded_community_info != 'undefined' ) {
			success(user_post.loaded_community_info)
		}
		else {
			(new BF_Request()).request('/buzzfeed/_edit_user', {
				method:'get',
				parameters:{
					action:'load_community_info',
					cb:(new Date()).getTime()
				},
				onSuccess:function(r){
					user_post.loaded_community_info = r;
					success(r);
					user_post.check_user_title(r);
				}
			});
		}
	}

	/* Utility methods */
	this.remove_class = function( obj, regex ) {
		var c_name = obj.className;
		c_name = c_name.replace(regex,'');
		obj.className = c_name;
	};

	this.message = function( target_id, args ) {
		var target = $(target_id);
		if ( !target || typeof args.message == 'undefined' || !args.message ) return;
		if ( args.show == true || args.hide == false ) {
			target.show();
			if ( !args.message ) {
				var log_data = {
					error       : 'user_post.message was called without a message',
					caller_name : this.message.caller.name ? this.message.caller.name : '',
					caller      : this.message.caller ? this.message.caller.toString() : '',
					args        : args
				};
				(new Image).src = '/buzzfeed/_error_logger?z=' + (new Date).getTime() + '&error=' + encodeURIComponent(JSON.stringify(log_data));
			}
		}
		else if ( args.show == false || args.hide == true  ) {
			target.hide();
		}
		target.update( args.message );
	};

	this.render_template = function (template_id, stash) {

		var template_el = $(template_id);
		var tmpl = new Template(template_el.innerHTML.unescapeHTML());
		var rendered = tmpl.evaluate(stash);
		if ($(template_id).getAttribute('rel:create_as'))
		{
			var el = new Element(template_el.getAttribute('rel:create_as'), {
				"class": template_el.getAttribute('rel:create_class')
			});
			el.update( rendered );
			return el;
		}
		else
		{
			return rendered;
		}

	};

	this.check_user_title = function(r){

		var obj = eval('('+r.responseText+')');

		if(obj.byline_description_freeform) {superlist_bylines.set_user_title(obj.byline_description_freeform);}
	}


	/**
	 * Show arbitrary error for quickpost, triggered by user_post:error:show event
	 *
	 * @param error_msg 	message to display
	 */
	this._show_quickpost_error = function(error_msg) {
		user_post.message('quickpost-error-msg',{show:true,message:error_msg});
		$('quickpost-error-msg').scrollTo();
	}

	/**
	 * Hide error for quickpost, triggered by user_post:error:hide event
	 */
	this._hide_quickpost_error = function() {
		user_post.message('quickpost-error-msg',{show:false,message:''});
	}

}

var user_post = new bf_user_post();
BuzzLoader.register(function(){user_post.init()},1);
