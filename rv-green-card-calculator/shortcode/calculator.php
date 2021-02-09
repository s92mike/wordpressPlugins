<?php 
if (!defined('ABSPATH')) exit;

define("PLUGIN_APP", plugin_dir_url(__FILE__)); //Plugin Directory
define("PLUGIN_PATH", plugin_dir_path(__FILE__)); //Plugin Directory Path

// require PLUGIN_PATH . 'inc/class-common.php';
require PLUGIN_PATH . 'inc/function.php';

function calc_system_main($atts = array(), $content = null, $tag = '') {
    $arg = array();
    $ext = null;
    $ver = isset($atts['version']) ? $atts['version'] : 0;
    switch ($ver) {
        case 1:
            wp_enqueue_script( 'main', PLUGIN_APP . 'js/main.js' , array(), filemtime( PLUGIN_PATH . 'js/main.js' ), true);
            $arg = array('src' => PLUGIN_APP . 'images/rapidvisathrobber.gif');
            $ext = 'v1';                   
            break;
        default:
            wp_enqueue_script( 'green-card-calculator', PLUGIN_APP . 'js/rv-green-card-calculator-public.js' , array(), filemtime( PLUGIN_PATH . 'js/rv-green-card-calculator-public.js' ), true);
            break;
    }
    ob_start();
    ccm_get_template_part('template-sections/calculator', $arg, $ext);
    return ob_get_clean();
}

add_shortcode('green-card-calculator','calc_system_main');