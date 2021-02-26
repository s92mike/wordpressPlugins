<?php 

if ( ! class_exists( 'Common' ) ) {
    class Common {
        public function script_attr($html='', $handle='') {
            switch ($handle) {
                case 'ui':
                    $html = str_replace( " id='ui-js'>", " id='ui-js' integrity='sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=' crossorigin='anonymous' />", $html ); 
                    break;
                case 'main':
                    $html = str_replace( " id='main-js'>", " id='main-js' type='text/babel' />", $html ); 
                    break;
                default:
                    break;
            }
            return $html;
        }

    }
}