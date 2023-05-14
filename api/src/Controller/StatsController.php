<?php 

namespace App\Controller;

use App\Repository\CompetitionRepository;
use App\Repository\PictureRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StatsController extends AbstractController
{
    public function __construct(private CompetitionRepository $competitionRepository, private UserRepository $userRepository, private PictureRepository $pictureRepository)
    {
    }

    #[Route('/stats', name: 'stats')]
    public function __invoke(): Response
    {
        $users =  $this->userRepository->findAll();
        $competitionCount = $this->competitionRepository->count([]);
        $organizersCompetitionCount = count(array_filter($users, fn ($user) => in_array('ROLE_ORGANIZER', $user->getRoles())));
        $photographersCompetitionCount = count(array_filter($users, fn ($user) => in_array('ROLE_PHOTOGRAPHER', $user->getRoles())));
        $membersCompetitionCount = $this->userRepository->count([]);
        $picturesCount = $this->pictureRepository->count([]);
        
        return $this->json([
            'competitionCount' => $competitionCount,
            'organizersCompetitionCount' => $organizersCompetitionCount,
            'photographersCompetitionCount' => $photographersCompetitionCount,
            'membersCompetitionCount' => $membersCompetitionCount,
            'picturesCount' => $picturesCount,
        ]);
    }
}
