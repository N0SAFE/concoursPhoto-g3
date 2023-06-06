<?php

namespace App\Controller;

use ApiPlatform\Symfony\Routing\IriConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Api\IriConverterInterface;
use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

class HealthcheckController extends AbstractController
{

    public function __construct(private IriConverterInterface $iriConverter, private SerializerContextBuilderInterface $contextBuilder, private SerializerInterface $serializer, private EntityManagerInterface $em, private Filesystem $fileSystem)
    {
    }

    #[Route('/healthcheck', name: 'healthcheck', methods: ['GET'])]
    public function healthcheck(): Response
    {
        // check for the env variable DATABASE_URL, MAILER_DNS, etc
        // check for the database connection
        // check for the mailer connection
        // the status code 200 should be returned in case of success
        // the status code 500 should be returned in case of failure

        try {
            $this->em->getConnection()->connect();
        } catch (\Exception $e) {
        }

        $connected = $this->em->getConnection()->isConnected();

        if (empty($_ENV['DATABASE_URL'])) {
            return $this->json([
                'status' => 'error',
                'message' => 'DATABASE_URL is not set',
                'ERR:code' => 'ERR:DB:URL:NOT:SET'
            ], 500);
        }

        if (empty($_ENV['MAILER_DSN'])) {
            return $this->json([
                'status' => 'error',
                'message' => 'MAILER_DSN is not set',
                'ERR:code' => 'ERR:MAILER:DNS:NOT:SET'
            ], 500);
        }

        if (empty($_ENV['JWT_SECRET_KEY'])) {
            return $this->json([
                'status' => 'error',
                'message' => 'JWT_SECRET_KEY is not set',
                'ERR:code' => "ERR:JWT:SECRET:KEY:NOT:SET"
            ], 500);
        }

        if ($this->fileSystem->exists(getcwd() . '/../config/jwt/public.pem') === false) {
            return $this->json([
                'status' => 'error',
                'message' => 'JWT public key file does not exist',
                'ERR:code' => "ERR:JWT:PUBLIC:KEY:FILE:NOT:FOUND"
            ], 500);
        }

        if (empty($_ENV['JWT_PUBLIC_KEY'])) {
            return $this->json([
                'status' => 'error',
                'message' => 'JWT_PUBLIC_KEY is not set',
                'ERR:code' => "ERR:JWT:PUBLIC:KEY:NOT:SET"
            ], 500);
        }

        if ($this->fileSystem->exists(getcwd() . '/../config/jwt/private.pem') === false) {
            return $this->json([
                'status' => 'error',
                "message" => 'JWT private key file does not exist',
                'ERR:code' => "ERR:JWT:PRIVATE:KEY:FILE:NOT:FOUND"
            ]);
        }


        if (!$connected) {
            return $this->json([
                'status' => 'error',
                'message' => 'Database is not connected',
                'ERR:code' => 'ERR:DB:NOT:CONNECTED',
            ], 500);
        }

        return $this->json([
            'status' => 'ok',
        ]);
    }
}
