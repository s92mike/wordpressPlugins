<?php
/**
 * Plugin Name: RapidVisa Green Card Calculator
 * Plugin URI: https://rapidvisa.com
 * Description: RapidVisa Green Card Calculator.
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
	global $post;
	if ($post->post_name === "sample-page") {
		//Dependencies
		wp_enqueue_script( 'jquery');
		wp_enqueue_script( 'moment');
		wp_enqueue_script( 'datetimepicker', PLUGIN_APP . 'bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js', array(), null, true );
		wp_enqueue_style( 'bootstrap', PLUGIN_APP . 'bootstrap-datetimepicker/css/bootstrap.min.css', array(), null, 'all' );
		wp_enqueue_style( 'datetimepicker', PLUGIN_APP . 'bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css', array(), null, 'all' );
		//main custom files
		wp_enqueue_style( 'green-card-calculator', PLUGIN_APP . 'css/rv-green-card-calculator-public.css', array() , filemtime( PLUGIN_PATH . 'css/rv-green-card-calculator-public.css' ), 'all' );
		wp_enqueue_script( 'green-card-calculator', PLUGIN_APP . 'js/rv-green-card-calculator-public.js' , array(), filemtime( PLUGIN_PATH . 'js/rv-green-card-calculator-public.js' ), true);


		//Development
		wp_enqueue_script('react');
		wp_enqueue_script('react-dom');
		wp_enqueue_script('babel', 'https://unpkg.com/babel-standalone@6.15.0/babel.min.js', array(), null, true);
		wp_enqueue_script( 'main', PLUGIN_APP . 'js/main.js' , array(), filemtime( PLUGIN_PATH . 'js/main.js' ), true);
		add_filter( 'script_loader_tag', __NAMESPACE__ . '\\wpdocs_my_add_sri', 10, 2 );
	}
}

function wpdocs_my_add_sri( $html, $handle ) {
	$common = new Common;
	return $common->script_attr($html, $handle);
}

add_action( 'wp_enqueue_scripts', 'my_enqueues', 11 );

function main_shortcodes() {
	include("shortcode/calculator.php");
}
add_action('init','main_shortcodes');
