<?php

namespace App\Serializer\Denormalizer;

use ApiPlatform\Api\IriConverterInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class LoggerDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    const ALREADY_CALLED = 'LOGGER_DENORMALIZER_ALREADY_CALLED';
    use DenormalizerAwareTrait;

    private $iriConverter;

    public function __construct(IriConverterInterface $iriConverter, private LoggerInterface $logger)
    {
        $this->iriConverter = $iriConverter;
    }

    /**
     * {@inheritdoc}
     */
    public function denormalize($data, $class, $format = null, array $context = [])
    {
        $context[self::ALREADY_CALLED] = true;

        $denormalizedData = $this->denormalizer->denormalize($data, $class, $format, $context);

        $this->logger->info('Denormalize {class} object', [
            'class' => is_object($data) ? get_class($data) : $data,
            'object' => $data,
        ]);

        $this->logger->info('context {context}', [
            'context' => $context,
        ]);
        
        $this->logger->info('denormalizedData {denormalizedData}', [
            'denormalizedData' => $denormalizedData,
        ]);

        return $denormalizedData;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return true;
    }
}