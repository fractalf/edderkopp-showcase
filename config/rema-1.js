module.exports =
{
    id: 1,
    url: {
        entry: 'https://www.rema.no',
    },
    pages: {
        shops: [
            {
                name: 'shops',
                elem: 'script',
                task: [
                    [ 'match', 'stores: (.*),\\n', 1 ],
                    [ 'js' ]
                ]
            }
        ]
    }
}
