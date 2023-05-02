<?php

namespace App\Controller;

use App\Entity\Competition;
use App\Repository\CompetitionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CompetitionController extends AbstractController
{
    const LAST_PICTURES_POSTED = 'lastPicturesPosted';
    const LAST_PICTURES_OBTAINED_VOTES = 'lastPicturesObtainedVotes';
    const PICTURES_OBTAINED_PRICE = 'picturesObtainedPrice';

    public function __construct(
        private CompetitionRepository $competitionRepository,
    ) {
    }

    public function __invoke(Request $request, Competition $competition): array
    {
        return match ($operationName = $request->attributes->get('_api_operation_name')) {
            self::LAST_PICTURES_POSTED => $this->competitionRepository->getLastPicturesPosted($competition),
            self::LAST_PICTURES_OBTAINED_VOTES => $this->competitionRepository->getLastPicturesObtainedVotes($competition),
            self::PICTURES_OBTAINED_PRICE => $this->competitionRepository->getPicturesObtainedPrice($competition),
            default => throw new \RuntimeException(sprintf('Unknown operation "%s".', $operationName))
        };
    }

}
