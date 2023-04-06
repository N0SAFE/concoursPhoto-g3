<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
    
class UserStateProcessor implements ProcessorInterface
{
    public function __construct(private readonly ProcessorInterface $processor, private readonly UserPasswordHasherInterface $passwordHasher, private readonly Security $security)
    {
    }
    
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if($operation instanceof Post){
            $data->setCreationDate(new \DateTimeImmutable());
        }
        
        if (!$data->getPlainPassword()) {
            return $this->processor->process($data, $operation, $uriVariables, $context);
        }
        
        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $data->getPlainPassword()
        );
        $data->setPassword($hashedPassword);
        $data->eraseCredentials();
    
        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}