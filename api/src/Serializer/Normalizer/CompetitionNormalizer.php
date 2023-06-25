<?php

namespace App\Serializer\Normalizer;

use App\Entity\Competition;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CompetitionNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'COMPETITION_NORMALIZER_ALREADY_CALLED';

    public function __construct(private Security $security)
    {
    }

    public function normalize(
        mixed   $object,
        ?string $format = null,
        array   $context = []
    )
    {
        $context[self::ALREADY_CALLED] = true;

        $user = $this->security->getUser();

        if ($user !== null) {
            $canEdit = $object->getOrganization()->getAdmins()->contains($user) || in_array("ROLE_ADMIN", $user->getRoles());

            $object->setUserCanEdit($canEdit);
        }

        return $this->normalizer->normalize(
            $object,
            $format,
            $context
        );
    }

    public function supportsNormalization(
        $data,
        ?string $format = null,
        array $context = []
    ): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Competition;
    }
}
