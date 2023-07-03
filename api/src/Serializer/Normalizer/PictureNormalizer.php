<?php

namespace App\Serializer\Normalizer;

use App\Entity\Competition;
use App\Entity\Picture;
use App\Entity\Vote;
use Doctrine\Common\Collections\ArrayCollection;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class PictureNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'PICTURE_NORMALIZER_ALREADY_CALLED';

    public function __construct(private Security $security)
    {
    }

    public function normalize(
        mixed $object,
        ?string $format = null,
        array $context = []
    ) {
        $context[self::ALREADY_CALLED] = true;

        $connectedUser = $this->security->getUser();
        
        $userVote = $object->getVotes()->findFirst(
            fn (int $key, Vote $vote) => $vote->getUser() === $connectedUser
        );
        
        $object->setHasBeenVoted(
            $userVote instanceof Vote
        );
        
        $object->setUserVote(
            $userVote instanceof Vote ? $userVote : null
        );

        $normalizedData = $this->normalizer->normalize(
            $object,
            $format,
            $context
        );

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

        return $data instanceof Picture;
    }
}
