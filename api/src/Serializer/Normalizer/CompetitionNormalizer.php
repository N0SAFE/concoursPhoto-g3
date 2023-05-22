<?php

namespace App\Serializer\Normalizer;

use App\Entity\Competition;
use App\Entity\Picture;
use App\Entity\Vote;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CompetitionNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'COMPETITION_NORMALIZER_ALREADY_CALLED';

    public function __construct()
    {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = [])
    {
        $context[self::ALREADY_CALLED] = true;

        if ($object->getState() === 2 || $object->getState() === 3) {
            $lastPicturesPosted = $object->getPictures()->toArray();
            usort($lastPicturesPosted, function ($a, $b) {
                // sort by id
                return $a->getId() <=> $b->getId();
            });
            $lastPicturesPosted = array_slice($lastPicturesPosted, 0, 8);
            $object->setAside(new ArrayCollection($lastPicturesPosted));
        } elseif ($object->getState() === 4 || $object->getState() === 5) {
            $lastPicturesObtainedVotes = $object->getPictures()->filter(function (Picture $picture) {
                return $picture->getVotes()->count() > 0;
            })->toArray();
            usort($lastPicturesObtainedVotes, function (Picture $a, Picture $b) {
                // sort by lastVote 
                $lastVoteA = $a->getVotes()->toArray();
                usort($lastVoteA, function (Vote $a, Vote $b) {
                    return $a->getVoteDate() <=> $b->getVoteDate();
                });
                $lastVoteA = $lastVoteA[count($lastVoteA) - 1];

                $lastVoteB = $b->getVotes()->toArray();
                usort($lastVoteB, function (Vote $a, Vote $b) {
                    return $a->getVoteDate() <=> $b->getVoteDate();
                });
                $lastVoteB = $lastVoteB[count($lastVoteB) - 1];

                return $lastVoteA->getVoteDate() <=> $lastVoteB->getVoteDate();
            });
            $lastPicturesObtainedVotes = array_slice($lastPicturesObtainedVotes, 0, 8);
            $object->setAside($data["aside"] = new ArrayCollection($lastPicturesObtainedVotes));
        } elseif ($object->getState() === 6) {
            $picturesObtainedPrice = $object->getPictures()->filter(function (Picture $picture) {
                return $picture->isPriceWon() !== null;
            })->toArray();
            usort($picturesObtainedPrice, function ($a, $b) {
                // sort by id
                return $a->getId() <=> $b->getId();
            });
            $picturesObtainedPrice = array_slice($picturesObtainedPrice, 0, 8);
            $object->setAside($data["aside"] = new ArrayCollection($picturesObtainedPrice));
        }

        $data = $this->normalizer->normalize($object, $format, $context);

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Competition;
    }
}
