( function() {
    CKEDITOR.plugins.add( 'imgur_drag',{

			requires: 'uploadimage',

			isSupportedEnvironment: function() {
				return CKEDITOR.plugins.clipboard.isFileApiSupported;
			},

            init: function( editor ) {

                ClientId = editor.config.imgurClientId;
                if(!ClientId) {
					return;
				}

				if ( !this.isSupportedEnvironment() ) {
					return;
				}

				var imgur_drag_and_drop_support = editor.config.imageUploadUrl !== undefined ? editor.config.imageUploadUrl : false;

				if (!(imgur_drag_and_drop_support && imgur_drag_and_drop_support === 'https://api.imgur.com/3/image')) {
					return;
				}

				editor.on( 'fileUploadRequest', function( evt ) {
					var notification = new CKEDITOR.plugins.notification( evt.editor, { message: RinEditor['Uploading'], type: 'success' } );
					notification.show();
					var xhr = evt.data.fileLoader.xhr;
					xhr.setRequestHeader( 'Authorization', "Client-ID " + ClientId );
					xhr.send( evt.data.fileLoader.file );
					evt.stop();
				} );
				editor.on( 'fileUploadResponse', function( evt ) {
					var fileLoader = evt.data.fileLoader,
						xhr = fileLoader.xhr,
						data = evt.data;

					try {
						var response = JSON.parse( xhr.responseText );

						if ( response.data.error ) {
							data.message = response.data.error;
						}

						if ( !response.success ) {
							evt.cancel();
						} else {
							data.fileName = response.data.id;
							data.url = response.data.link;
							data.width = response.data.width;
							data.height = response.data.height;

							evt.stop();
						}
					} catch ( err ) {
						data.message = fileLoader.lang.filetools.responseError;
						evt.cancel();
					}
				} );
            }
        });
})();
