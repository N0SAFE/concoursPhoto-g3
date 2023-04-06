<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;

class OrganisationStatePorcessor implements ProcessorInterface
{
    public function __construct(private readonly ProcessorInterface $processor)
    {
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if($operation instanceof Post){
            $data->setCreationDate(new \DateTimeImmutable());
        }

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}