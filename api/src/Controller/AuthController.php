<?php

namespace App\Controller;

use ApiPlatform\Api\IriConverterInterface;
use ApiPlatform\JsonLd\ContextBuilderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;
use App\Entity\User;

#[ApiResource]
class AuthController extends AbstractController
{
    private IriConverterInterface $iriConverter;
    private SerializerContextBuilderInterface $contextBuilder;
    private SerializerInterface $serializer;
    public function __construct(IriConverterInterface $iriConverter, SerializerContextBuilderInterface $contextBuilder, SerializerInterface $serializer)
    {
        $this->iriConverter = $iriConverter;
        $this->contextBuilder = $contextBuilder;
        $this->serializer = $serializer;
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request)
    {
        // remove cookie from browser [BEARER, refreshToken]
        $request->cookies->remove('BEARER');
        $request->cookies->remove('refreshToken');

        // remove cookie from server
        $response = new Response();
        $response->headers->clearCookie('BEARER', '/', null, true, true, "None");
        $response->headers->clearCookie('refreshToken', '/', null, true, true, "None");

        return $response;
    }

    #[Route('/whoami', name: 'whoami', methods: ['GET'])]
    public function whoami()
    {
        return new JsonResponse($this->serializer->serialize($this->getUser(), 'jsonld', ["groups" => ["user:current:read"]]), 201, [], true);
    }
}
