<?php

namespace App\Controller;

use App\Repository\CompetitionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
class CompetitionController extends AbstractController
{
    public function __construct(
        private CompetitionRepository $competitionRepository,
    ) {
    }
    
    
    #[Route('/competitions/{id}/pictures', name: 'competition_pictures', methods: ['GET'])]
    public function getPictures(int $id): Response
    {
        $competition = $this->competitionRepository->findOneBy(['id' => $id]);
        // TODO: add if statement based on the competition status (ongoing, ended, etc.)
        return $this->json(["aside" => $this->competitionRepository->getLastPicturesPosted($competition), "results" => $this->competitionRepository->getPicturesObtainedPrice($competition), "asideLabel" => "Dernières photos soumises"]);
        // or
        return $this->json(["aside" =>  $this->competitionRepository->getLastPicturesObtainedVotes($competition), "results" => $this->competitionRepository->getPicturesObtainedPrice($competition),  "asideLabel" => "Dernières photos ayant obtenu un vote"]);
    }

}
