<?php

namespace App\Controller;

use App\Repository\NotificationTypeRepository;
use App\Repository\UserRepository;
use App\Service\MailSender;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    const USER_COMPETITIONS = 'userCompetitions';

    public function __construct(
        private UserRepository $userRepository,
        private NotificationTypeRepository $notificationTypeRepository,
        private MailSender $mailSender,
    ) {
    }

    public function __invoke(Request $request, User $user, int $notificationTypeId): array
    {
        return match ($operationName = $request->attributes->get('_api_operation_name')) {
            self::USER_COMPETITIONS => $this->userRepository->getCompetitionsParticipates($user),
            default => throw new \RuntimeException(sprintf('Unknown operation "%s".', $operationName))
        };
    }

    #[Route("/test/notify/{notificationTypeId}")]
    public function getAllUserByNotificationType($notificationTypeId){
        $users = $this->userRepository->getAllUserByNotificationType($notificationTypeId);
        if ($users) {
            foreach ($users as $user) {
                $this->mailSender->sendMail("admin@admin.com", $user->getEmail(), "Concours publié", "competition_published.html.twig");
            }
        }
        return $users;
    }
}