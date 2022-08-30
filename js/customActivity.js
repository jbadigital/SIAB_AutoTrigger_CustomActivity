define( function( require ) {

    'use strict';

    var Postmonger = require( 'postmonger' );
    var $ = require( 'jquery' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1;
    var tokens;
    var endpoints;

    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        if (payload) {
            toJbPayload = payload;
        }
          gotoStep(step);
    });

    connection.on('requestedTokens', function(data) {
        if( data.error ) {
            console.error( data.error );
        } else {
            tokens = data;
            console.log("tokens",data);
        }
    });

    connection.on('requestedEndpoints', function(data) {
        if( data.error ) {
            console.error( data.error );
        } else {
            endpoints = data;
            console.log("endpoints",endpoints);
        }
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', text: 'next', enabled: true });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 2: // Only 2 steps, so the equivalent of 'done' - send off the payload
                save();
                break;
        }
    };

    function save() {
        // get the Key field from the Interactions API call for the journey
        var eventDefinitionKey = "APIEvent-8f92dbca-baa3-30f1-fb25-72f3a7e20059";

        // this will be sent into the custom activity body within the inArguments array
        toJbPayload['arguments'].execute.inArguments = [
          {"LetterRefId":"{{Event."+ eventDefinitionKey + ".LetterRefId}}"},
          {"EventInstanceID":"{{Event."+ eventDefinitionKey + ".EventInstanceID}}"},
          {"cloupra__Person__c":"{{Event."+ eventDefinitionKey + ".cloupra__Person__c}}"},
          {"Service_Id":"{{Event."+ eventDefinitionKey + ".Service_Id}}"},
          {"FirstName":"{{Event."+ eventDefinitionKey + ".FirstName}}"},
          {"Salutation":"{{Event."+ eventDefinitionKey + ".Salutation}}"},
          {"LastName":"{{Event."+ eventDefinitionKey + ".LastName}}"},
          {"MobilePhone":"{{Event."+ eventDefinitionKey + ".MobilePhone}}"},
          {"Email":"{{Event."+ eventDefinitionKey + ".Email}}"},
          {"Member_Identifier__c":"{{Event."+ eventDefinitionKey + ".Member_Identifier__c}}"},
          {"Is_Pension_Member_Account__c":"{{Event."+ eventDefinitionKey + ".Is_Pension_Member_Account__c}}"},
          {"Employer_Last_Contribution_Date__c":"{{Event."+ eventDefinitionKey + ".Employer_Last_Contribution_Date__c}}"},
 	  {"Cont_Member_Pre_Last_Date__c":"{{Event."+ eventDefinitionKey + ".Cont_Member_Pre_Last_Date__c}}"},
          {"Cont_Member_Post_Last_Date__c":"{{Event."+ eventDefinitionKey + ".Cont_Member_Post_Last_Date__c}}"},
	  {"RO_Last_Rollover_Date__c":"{{Event."+ eventDefinitionKey + ".RO_Last_Rollover_Date__c}}"},
	  {"HasInsurance":"{{Event."+ eventDefinitionKey + ".HasInsurance}}"},
	  {"Preference_Center_Url__c":"{{Event."+ eventDefinitionKey + ".Preference_Center_Url__c}}"},
	  {"Pension_Policy_Number__c":"{{Event."+ eventDefinitionKey + ".Pension_Policy_Number__c}}"},
	  {"Account_Member_Number__c":"{{Event."+ eventDefinitionKey + ".Account_Member_Number__c}}"},
	  {"Marketing_Account_Balance__c":"{{Event."+ eventDefinitionKey + ".Marketing_Account_Balance__c}}"},
	  {"FUNDID":"{{Event."+ eventDefinitionKey + ".FUNDID}}"},
	  {"BRAND_TYPE":"{{Event."+ eventDefinitionKey + ".BRAND_TYPE}}"},
	  {"PLAN_NUMBER":"{{Event."+ eventDefinitionKey + ".PLAN_NUMBER}}"},
	  {"DBCODE":"{{Event."+ eventDefinitionKey + ".DBCODE}}"},
	  {"SUBFUND":"{{Event."+ eventDefinitionKey + ".SUBFUND}}"},
	  {"template":"{{Event."+ eventDefinitionKey + ".template}}"},
	  {"TemplateType":"{{Event."+ eventDefinitionKey + ".TemplateType}}"},
	  {"DateEntered":"{{Event."+ eventDefinitionKey + ".DateEntered}}"},
	  {"Communication_Name":"{{Event."+ eventDefinitionKey + ".Communication_Name}}"},
	  {"Source__C":"{{Event."+ eventDefinitionKey + ".Source__C}}"},
	  {"Type__C_Desc":"{{Event."+ eventDefinitionKey + ".Type__C_Desc}}"},
	  {"DE_Key":"{{Event."+ eventDefinitionKey + ".DE_Key}}"},
	  {"TestRecord":"{{Event."+ eventDefinitionKey + ".TestRecord}}"},
		  {"DEROWID":"{{Event."+ eventDefinitionKey + "._customObjectKey}}"},
          {"TriggeredSendExternalKey":"{{Event."+ eventDefinitionKey + ".TriggeredSendExternalKey}}"}
        ];

        toJbPayload.metaData.isConfigured = true;  //this is required by JB to set the activity as Configured
        connection.trigger('updateActivity', toJbPayload);
    };

});
