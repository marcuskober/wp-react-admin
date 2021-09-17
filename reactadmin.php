<?php
/**
 * Plugin Name: Admin React Example
 * Description: An example for using react for admin option pages
 * Version: 1.0.0
 * Author: Marcus Kober
 * Author URI: https://marcuskober.de
 * License: GPL-3.0+
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: adminreact
 */

define('ADMIN_REACT_VERSION', '1.0.0' );
define('ADMIN_REACT_URL', plugins_url('/', __FILE__));

add_action('admin_menu', function() {
    $pageHook = add_options_page(
		'AdminReact',
		'AdminReact',
		'manage_options',
		'admin-react',
		function() {
            ?>
            <div id="react-admin-app"></div>
            <?php
        }
	);

    add_action("load-{$pageHook}", function() {
        wp_enqueue_script('admin-react-plugin-script', ADMIN_REACT_URL . 'dist/app.js', ['wp-api', 'wp-i18n', 'wp-components', 'wp-element'], ADMIN_REACT_VERSION, true);
        wp_enqueue_style('admin-react-plugin-style', ADMIN_REACT_URL . 'dist/app.css', ['wp-components'], ADMIN_REACT_VERSION);
    });
});

add_action('init', function() {
    register_setting(
		'admin_react_settings',
		'admin_react_example_bool_1',
        [
            'type' => 'boolean',
            'show_in_rest' => true,
            'default' => false,
        ]
	);

	register_setting(
		'admin_react_settings',
		'admin_react_example_text_1',
        [
            'type' => 'string',
            'show_in_rest' => true,
        ]
	);
});
