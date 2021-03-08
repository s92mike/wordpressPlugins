<?php 

if ( ! class_exists( 'Common' ) ) {
    class Common {
        public function script_attr($html='', $handle='') {
            switch ($handle) {
                case 'ui':
                    $html = str_replace( " id='ui-js'>", " id='ui-js' integrity='sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=' crossorigin='anonymous' />", $html ); 
                    break;
                case 'react-date-calc-nat':
                    $html = str_replace( " id='react-date-calc-nat-js'>", " id='react-date-calc-nat-js' type='text/babel' />", $html ); 
                    break;
                default:
                    break;
            }
            return $html;
        }
        public function get_shortcodes() {
            global $shortcode_tags;
            $shortcodes = $shortcode_tags;
            $tmp = [];
            // sort the shortcodes with alphabetical order
            ksort($shortcodes);
            foreach ($shortcodes as $shortcode => $value){
                if (strpos($shortcode, 'rv') !== false) {
                    $tmp[] = $shortcode;
                }
            }
            return $tmp;
        }
    }
}