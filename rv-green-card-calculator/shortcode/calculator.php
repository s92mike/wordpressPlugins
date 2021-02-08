<?php 
if (!defined('ABSPATH')) exit;

define("PLUGIN_APP", plugin_dir_url(__FILE__)); //Plugin Directory
define("PLUGIN_PATH", plugin_dir_path(__FILE__)); //Plugin Directory Path

// require PLUGIN_PATH . 'inc/class-common.php';
require PLUGIN_PATH . 'inc/function.php';


function nat_calc_system() {
    ob_start();	
    $arg = array('src' => PLUGIN_APP . 'images/rapidvisathrobber.gif');
	ccm_get_template_part('template-sections/calculator', $arg);
	return ob_get_clean();
}

add_shortcode('green-card-calculator','nat_calc_system');

function calc_system_stable() {
    wp_enqueue_script( 'main', PLUGIN_APP . 'js/main.js' , array(), filemtime( PLUGIN_PATH . 'js/main.js' ), true);
    ob_start();
    ccm_get_template_part('template-sections/calculator',array(), 'dev');
    return ob_get_clean();
}

add_shortcode('green-card-calculator-dev','calc_system_stable');