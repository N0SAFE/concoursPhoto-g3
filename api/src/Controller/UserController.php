<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;

class UserController extends AbstractController
{
    const USER_COMPETITIONS = 'userCompetitions';

    public function __construct(
        private UserRepository $userRepository,
    ) {
    }

    public function __invoke(Request $request, User $user, int $notificationTypeId): array
    {
        return match ($operationName = $request->attributes->get('_api_operation_name')) {
            self::USER_COMPETITIONS => $this->userRepository->getCompetitionsParticipates($user),
            default => throw new \RuntimeException(sprintf('Unknown operation "%s".', $operationName))
        };
    }
}