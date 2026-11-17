<?php
require_once "../classes/JsonStorage.php";


class categoryDAO {
    private $storage;
    public function __construct($file)
    {
        $this->storage = new JsonStorage($file);
   }
    public function getAll(){
        return $this->storage->read();
    }
    
    public function  saveAll($data){
      $this->storage->write($data);
    }
}








?>