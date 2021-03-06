// @noflow
/* eslint no-unused-vars: "off" */
/* eslint-disable import/no-extraneous-dependencies */

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('dotenv').load();

  config.env.GRAPHQL_URI = process.env.GRAPHQL_URI;
  config.env.KIWILOGIN_USER = process.env.KIWILOGIN_USER;
  config.env.TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
  config.env.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

  return config;
};
