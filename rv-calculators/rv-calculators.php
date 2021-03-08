<?php
/**
 * Plugin Name: RapidVisa Calculators
 * Plugin URI: https://rapidvisa.com
 * Description: RapidVisa Calculaters e.g. Naturalization schedule
 * Version: 1.0
 * Author: RapidVisa Inc.
 * Author URI: https://rapidvisa.com
 * Developer: Francis Miguel Abella
 */

if (!defined('ABSPATH')) exit;

define("PLUGIN_APP", plugin_dir_url(__FILE__)); //Plugin Directory
define("PLUGIN_PATH", plugin_dir_path(__FILE__)); //Plugin Directory Path

require PLUGIN_PATH . 'inc/class-common.php';

add_action( 'admin_menu', 'add_rv_calculator_custom_menu' );
function add_rv_calculator_custom_menu()  {
	//Create Income Calculator Menu on Admin Dashboard
	add_menu_page('RapidVisa Calculators Application','RapidVisa Calculators','manage_options','app_rv_calc','open_main_page_rv','dashicons-welcome-widgets-menus','10');
}
function open_main_page_rv() {
	$common = new Common();
	$shortcodes = $common->get_shortcodes();
	// sort the shortcodes with alphabetical order
	ksort($shortcodes);
	$shortTitleList = [
		'rv-nat-sched-calculator' => 'Date Calculator for Naturalization',
		'rv-roc-calculator' => 'Removal of Conditions Early Filing Date Calculator	'
	];

	include("admin/main_page.php");
	wp_enqueue_style( 'bootstrap', PLUGIN_APP . 'dist/bootstrap-datetimepicker/css/bootstrap.min.css', array(), null, 'all' );
	wp_enqueue_script( 'boostrap', PLUGIN_APP . 'dist/bootstrap-datetimepicker/js/bootstrap.min.js', array(), null, true );
	wp_enqueue_style( 'admin-rv-calc', PLUGIN_APP . 'admin/css/admin-rv-calc.css', array(), null, 'all' );
}

add_action( 'wp_enqueue_scripts', 'my_enqueues', 11 );
function my_enqueues() {
	$common = new Common();
	$shortcodes = $common->get_shortcodes();
	if ( shortcode_exists( $shortcodes[0] ) ) {
		//Dependencies
		wp_enqueue_script( 'jquery');
		wp_enqueue_script( 'moment');
		wp_enqueue_script( 'datetimepicker', PLUGIN_APP . 'dist/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js', array(), null, true );
		wp_enqueue_style( 'bootstrap', PLUGIN_APP . 'dist/bootstrap-datetimepicker/css/bootstrap.min.css', array(), null, 'all' );
		wp_enqueue_style( 'datetimepicker', PLUGIN_APP . 'dist/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css', array(), null, 'all' );
	}
}

add_action('init','main_shortcodes');
function main_shortcodes() {
	include("shortcode/calculators.php");
}
