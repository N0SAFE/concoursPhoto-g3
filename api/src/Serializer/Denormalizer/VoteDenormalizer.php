<?php

namespace App\Serializer\Denormalizer;

use ApiPlatform\Api\IriConverterInterface;
use App\Entity\Vote;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class VoteDenormalizer implements
    ContextAwareDenormalizerInterface,
    DenormalizerAwareInterface
{
    const ALREADY_CALLED = 'VOTE_DENORMALIZER_ALREADY_CALLED';
    use DenormalizerAwareTrait;

    private $iriConverter;

    public function __construct(
        IriConverterInterface $iriConverter,
        private LoggerInterface $logger
    ) {
        $this->iriConverter = $iriConverter;
    }

    /**
     * {@inheritdoc}
     */
    public function denormalize(
        $data,
        $class,
        $format = null,
        array $context = []
    ) {
        $context[self::ALREADY_CALLED] = true;

        $denormalizedData = $this->denormalizer->denormalize(
            $data,
            $class,
            $format,
            $context
        );

        $denormalizedData->setVoteDate(new \DateTime('now'));

        return $denormalizedData;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsDenormalization(
        $data,
        $type,
        $format = null,
        array $context = []
    ): bool {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return Vote::class === $type;
    }
}
