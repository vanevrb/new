var config = {
    host: 'https://1n671058uh9x2yz.us.qlikcloud.com/',
    prefix: '/',
    port: 443,
    isSecure: true,
    webIntegrationId: 'HLSy2Ypv7aXMUQVf1dprDyjeGr-qSs9g'
};

//Redirect to login if user is not logged in
async function login() {
    function isLoggedIn() {
        return fetch("https://"+config.host+"/api/v1/users/me", {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'qlik-web-integration-id': config.webIntegrationId,
            },
        }).then(response => {
            return response.status === 200;
        });
    }
    return isLoggedIn().then(loggedIn =>{
        if (!loggedIn) {
            window.location.href = "https://"+config.host+"/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + location.href;
            throw new Error('not logged in');
        }
    });
}
login().then(() => {
    require.config( {
        baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
        webIntegrationId: config.webIntegrationId
    } );
    //Load js/qlik after authentication is successful
    require( ["js/qlik"], function ( qlik ) {
        qlik.on( "error", function ( error ) {
            $( '#popupText' ).append( error.message + "<br>" );
            $( '#popup' ).fadeIn( 1000 );
        } );
        $( "#closePopup" ).click( function () {
            $( '#popup' ).hide();
        } );
        //open apps -- inserted here --
        var app = qlik.openApp( 'e15fe4cf-afa6-484b-b910-2a9e1492e8c0', config );
       
        //get objects -- inserted here --
        app.visualization.get('ZhHKJAx').then(function(vis){
        vis.show("QV01");
        } );
        app.visualization.get('pPPkAb').then(function(vis){
        vis.show("QV02");
        } );
        
    } );
});
