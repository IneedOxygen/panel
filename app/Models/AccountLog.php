<?php

namespace Pterodactyl\Models;

use Pterodactyl\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $user_id
 * @property string $action
 * @property string $ip_address
 * @property \Carbon\CarbonImmutable $created_at
 * @property \Pterodactyl\Models\User|null $user
 */
class AuthLog extends Model
{
    use HasFactory;

    public const RESOURCE_NAME = 'account_log';

    /**
     * @var string
     */
    protected $table = 'account_logs';

    /**
     * @var string[]
     */
    public static $validationRules = [
        'user_id' => 'integer',
        'action' => 'string|max:191',
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected array $fillable = ['user_id', 'action'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Creates a new model and returns it, attaching device information and the
     * currently authenticated user if available. This model is not saved at this point, so
     * you can always make modifications to it as needed before saving.
     *
     * @return $this
     */
    public static function instance(string $action, string $ip_address)
    {
        /** @var Request $request */
        $request = Container::getInstance()->make('request');

        if (!$request instanceof Request) {
            $request = null;
        }

        return (new self())->fill([
            'user_id' => ($request && $request->user()) ? $request->user()->id : null,
            'action' => $action,
            'ip_address' => $ip_address ?? '--',
        ]);
    }
}