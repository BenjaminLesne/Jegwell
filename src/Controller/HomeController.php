<?php

namespace App\Controller;

use App\Constants\Routes;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class Category
{
    public $name;
    public $url;
    public $image_location;

    public function __construct($name, $url, $image_location)
    {
        $this->name = $name;
        $this->url = $url;
        $this->image_location = $image_location;
    }
}
class HomeController extends AbstractController
{
    private $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    #[Route('/', name: Routes::HOME)]
    public function index(): Response
    {
        $categories = $this->repository->findAll();

        return $this->render('home/index.html.twig', [
            'categories' => $categories,
        ]);
    }
}
