<?php

namespace App\Serializer\Normalizer;

use App\Entity\Competition;
use App\Entity\Picture;
use App\Entity\Vote;
use Doctrine\Common\Collections\ArrayCollection;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class LoggerNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'LOGGER_NORMALIZER_ALREADY_CALLED';

    public function __construct(private LoggerInterface $logger)
    {
    }

    public function normalize(
        mixed $object,
        ?string $format = null,
        array $context = []
    ) {
        $context[self::ALREADY_CALLED] = true;

        $normalizedData = $this->normalizer->normalize(
            $object,
            $format,
            $context
        );

        $this->logger->info('Normalize {class} object', [
            'class' => is_object($object) ? get_class($object) : $object,
            'object' => $object,
        ]);

        $this->logger->info('context {context}', [
            'context' => $context,
        ]);

        $this->logger->info('normalizedData {data}', [
            'normalizedData' => $normalizedData,
        ]);

        return $normalizedData;
    }

    public function supportsNormalization(
        $data,
        ?string $format = null,
        array $context = []
    ): bool {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return true;
    }
}
