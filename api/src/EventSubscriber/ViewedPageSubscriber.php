<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class ViewedPageSubscriber implements EventSubscriberInterface
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => ['onEvents', EventPriorities::POST_READ],
        ];
    }

    public function onEvents(RequestEvent $event): void
    {
        match ($event->getRequest()->attributes->get('_api_operation_name')) {
            'CompetitionView' => $this->onCompetitionView($event),
            default => '',
        };
    }

    public function onCompetitionView(RequestEvent $event)
    {
        $competition = $event->getRequest()->attributes->get('data');

        $count = $competition->setConsultationCount(
            $competition->getConsultationCount() + 1
        );

        $this->entityManager->persist($count);
        $this->entityManager->flush();
    }
}
