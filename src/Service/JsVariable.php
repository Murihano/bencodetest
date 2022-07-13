<?php

namespace App\Service;

/**
 * AS [AKTARMA]
 * VAR JS CLASS TO SEND VARIABLE FROM PHP TO JS FILE
 */
class JsVariable
{
    private array $var_js = [];

    /**
     * SET VARIABLE
     */
    public function set_var_js( string $key = '', string $value= '', bool $overwrite = true): bool
    {
        // check param
        if
        (
            !is_string($key)
            ||
            $key == ''
            ||
            $value == null
            ||
            is_bool($overwrite) === true && isset($this->var_js[$key]) === true
        )
        {
            return false;
        }

        // set variable
        $this->var_js[$key]=$value;

        return true;
    }


    /**
     *  retrieve varjs array
     */
    public function get_var_js(): array
    {
        return $this->var_js;
    }


    /**
     * JSON
     * @return false|string format
     */
    public function get_json(): false|string
    {
        $return = $this->var_js;

        return json_encode( $return );
    }

}
