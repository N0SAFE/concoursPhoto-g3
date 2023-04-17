<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    if(isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/api/') === 0){
        $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], strlen('/api'));
    }
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};  