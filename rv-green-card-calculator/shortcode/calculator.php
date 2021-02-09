<?php 
if (!defined('ABSPATH')) exit;

define("PLUGIN_APP", plugin_dir_url(__FILE__)); //Plugin Directory
define("PLUGIN_PATH", plugin_dir_path(__FILE__)); //Plugin Directory Path

require PLUGIN_PATH . 'inc/function.php';

function calc_system_main($atts = array(), $content = null, $tag = '') {
    ob_start();
    $arg = array();
    $ext = null;
    $ver = isset($atts['version']) ? $atts['version'] : 0;
    switch ($ver) {
        case 1:
            wp_enqueue_script( 'moment');
            wp_enqueue_script( 'datetimepicker', PLUGIN_APP . 'bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js', array(), null, true );
            wp_enqueue_style( 'bootstrap', PLUGIN_APP . 'bootstrap-datetimepicker/css/bootstrap.min.css', array(), null, 'all' );
            wp_enqueue_style( 'datetimepicker', PLUGIN_APP . 'bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css', array(), null, 'all' );
            wp_enqueue_script( 'green-card-calculator', PLUGIN_APP . 'js/rv-green-card-calculator-public.js' , array(), filemtime( PLUGIN_PATH . 'js/rv-green-card-calculator-public.js' ), true);
            $arg = array('src' => PLUGIN_APP . 'images/rapidvisathrobber.gif');
            $ext = 'v1';                   
            break;
        default:
            wp_enqueue_script('react');
            wp_enqueue_script('react-dom');
            wp_enqueue_script('babel', 'https://unpkg.com/babel-standalone@6.15.0/babel.min.js', array(), null, true);
            wp_enqueue_script( 'main', PLUGIN_APP . 'js/main.js' , array(), filemtime( PLUGIN_PATH . 'js/main.js' ), true);
            add_filter( 'script_loader_tag', __NAMESPACE__ . '\\wpdocs_my_add_sri', 10, 2 );

            break;
    }
    ccm_get_template_part('template-sections/calculator', $arg, $ext);
    return ob_get_clean();
}

add_shortcode('green-card-calculator','calc_system_main');