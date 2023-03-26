<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class Category {
    public $name;
    public $url;
    public $image_location;

    public function __construct($name, $url, $image_location) {
        $this->name = $name;
        $this->url = $url;
        $this->image_location = $image_location;
    }
}
class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        $categories = [
            new Category('Books', 'books', '/images/books.png'),
            new Category('Movies','movies', '/images/movies.png'),
            new Category('Music','music', '/images/music.png'),
            new Category('Food', 'food', '/images/food.png'),
            new Category('Travel', 'travel', '/images/travel.png'),
            new Category('Family', 'family', '/images/family.png'),
            new Category('Sports','sports', '/images/sports.png'),
            new Category('Electronics', 'electronics', '/images/electronics.png'),
            new Category('Entertainment', 'entertainment', '/images/entertainment.png'),
            new Category('Entertainment', 'entertainment', '/images/entertainment')
        ];

        return $this->render('home/index.html.twig', [
            'categories' => $categories,
        ]);
    }
}
