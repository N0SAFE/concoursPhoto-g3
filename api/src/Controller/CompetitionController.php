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
    public function __construct(
        private CompetitionRepository $competitionRepository,
    ) {
    }

    public function __invoke(Request $request, Competition $competition): array
    {
        $operationName = $request->attributes->get('_api_operation_name');

        if ($operationName === 'lastPicturesPosted') {
            return $this->competitionRepository->getLastPicturesPosted($competition);

        } else if ($operationName === 'lastPicturesObtainedVotes') {
            return $this->competitionRepository->getLastPicturesObtainedVotes($competition);

        } else if ($operationName === 'picturesObtainedPrice') {
            return $this->competitionRepository->getPicturesObtainedPrice($competition);

        } else {
            throw new \RuntimeException(sprintf('Unknown operation "%s".', $operationName));
        }
    }

}
