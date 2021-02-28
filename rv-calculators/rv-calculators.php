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

function my_enqueues() {
	if ( shortcode_exists( 'nat-sched-calculator' ) ) {
		//Dependencies
		wp_enqueue_script( 'jquery');
		wp_enqueue_script( 'moment');
		wp_enqueue_script( 'datetimepicker', PLUGIN_APP . 'bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js', array(), null, true );
		wp_enqueue_style( 'bootstrap', PLUGIN_APP . 'bootstrap-datetimepicker/css/bootstrap.min.css', array(), null, 'all' );
		wp_enqueue_style( 'datetimepicker', PLUGIN_APP . 'bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css', array(), null, 'all' );
		//main custom files
		wp_enqueue_style( 'green-card-calculator', PLUGIN_APP . 'css/rv-green-card-calculator-public.css', array() , filemtime( PLUGIN_PATH . 'css/rv-green-card-calculator-public.css' ), 'all' );
	}
}

add_action( 'wp_enqueue_scripts', 'my_enqueues', 11 );

function main_shortcodes() {
	include("shortcode/calculator.php");
}

add_action('init','main_shortcodes');
