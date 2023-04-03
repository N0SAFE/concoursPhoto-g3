<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'user_')]
class AuthController extends AbstractController
{
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request)
    {
        // remove cookie from browser [BEARER, refreshToken]
        $request->cookies->remove('BEARER');
        $request->cookies->remove('refreshToken');

        // remove cookie from server
        $response = new Response();
        $response->headers->clearCookie('BEARER');
        $response->headers->clearCookie('refreshToken');

        return $response;
    }

    #[Route('/whoami', name: 'whoami', methods: ['GET'])]
    public function whoami()
    {
        return $this->json($this->getUser());
    }
}
