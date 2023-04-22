<?php

namespace App\Listeners;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

class AuthenticationSuccessListener
{
    private $secure = true;

    public function __construct()
    {
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $response = $event->getResponse();
        $data = $event->getData();

        $token = $data['token'];
        $event->setData($data);

        $response->headers->setCookie(
            new Cookie('BEARER', $token, new \DateTime('+1 day'), '/', null, $this->secure, true, false, "None")
        );

        $event->setData(['message' => 'logged in', 'code' => 200]);
    }
}
