SELECT id,
       salt,
       type,
       user_id,
       created_date,
       user_label,
       secret_data,
       credential_data,
       priority,
       version
FROM public.credential
LIMIT 1000;
SELECT
    u.id,
    u.username,
    u.email,
    c.type
FROM credential c
JOIN user_entity u
    ON c.user_id = u.id
WHERE c.type = 'password';


