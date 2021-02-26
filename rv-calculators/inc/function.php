<?php 
require PLUGIN_PATH . 'inc/class-common.php';
function ccm_get_template_part($slug, $arg = array(), $name = null) {
    do_action("ccm_get_template_part_{$slug}", $slug, $name);

    $templates = array();
    if (isset($name))
        $templates[] = "{$slug}-{$name}.php";

    $templates[] = "{$slug}.php";

    ccm_get_template_path($templates, true, false, $arg);
}

function ccm_get_template_path($template_names, $load = false, $require_once = true, $arg = array() ) {
    $located = ''; 
    foreach ( (array) $template_names as $template_name ) { 
      if ( !$template_name ) 
        continue; 

      /* search file within the PLUGIN_DIR_PATH only */ 
      if ( file_exists(PLUGIN_PATH . $template_name)) { 
        $located = PLUGIN_PATH . $template_name; 
        break; 
      } 
    }

    if ( $load && '' != $located )
        load_template( $located, $require_once, $arg );
    return $located;
}


function wpdocs_my_add_sri( $html, $handle ) {
	$common = new Common;
	return $common->script_attr($html, $handle);
}
