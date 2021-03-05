<?php 
if (!defined('ABSPATH')) exit;

define("PLUGIN_APP", plugin_dir_url(__FILE__)); //Plugin Directory
define("PLUGIN_PATH", plugin_dir_path(__FILE__)); //Plugin Directory Path

require PLUGIN_PATH . 'inc/function.php';

/**
 * Date Calculator for Naturalization
 */

function date_calculator_naturalization($atts = array(), $content = null, $tag = '') {
    ob_start();
    $arg = array('src' => PLUGIN_APP . 'images/rapidvisathrobber.gif');
    $ext = null;
    $ver = isset($atts['version']) ? $atts['version'] : 0;
    switch ($ver) {
        case 2:
            wp_enqueue_script( 'classes-date-calc-nat', PLUGIN_APP . 'js/classes-date-calculator-naturalization.js' , array(), filemtime( PLUGIN_PATH . 'js/classes-date-calculator-naturalization.js' ), true);
            $ext = 'v2';
            break;
        case 1:
            wp_enqueue_script('react');
            wp_enqueue_script('react-dom');
            wp_enqueue_script('babel', 'https://unpkg.com/babel-standalone@6.15.0/babel.min.js', array(), null, true);
            wp_enqueue_script( 'react-date-calc-nat', PLUGIN_APP . 'js/react-date-calculator-naturalization.js' , array(), filemtime( PLUGIN_PATH . 'js/react-date-calculator-naturalization.js' ), true);
            add_filter( 'script_loader_tag', __NAMESPACE__ . '\\wpdocs_my_add_sri', 10, 2 );
            break;
        default:
            wp_enqueue_script( 'date-calc-nat', PLUGIN_APP . 'js/date-calculator-naturalization.js' , array(), filemtime( PLUGIN_PATH . 'js/date-calculator-naturalization.js' ), true);
            $ext = 'v1';  
            break;
    }
    ccm_get_template_part('template-sections/calculator', $arg, $ext);
    return ob_get_clean();
}

add_shortcode('nat-sched-calculator','date_calculator_naturalization');
