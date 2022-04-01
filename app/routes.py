import random
import pandas as pd
from datetime import date
from flask import render_template
from app.game import *
from app import app

@app.route('/') 
def index():
    year = int(date.today().timetuple().tm_year)
    day = int(date.today().timetuple().tm_yday) - 1
    cast = pd.read_csv('app/static/data/cast.csv')
    movies = pd.read_csv('app/static/data/movies.csv')
    actors = pd.read_csv('app/static/data/actors.csv')
    top = pd.concat([movies.iloc[:226], actors.iloc[:139]]).sample(frac=1, random_state=year)
    current = top.iloc[day].to_dict()
    current['answer'] = True
    rollcall = [current]
    index = 0
    while True:
        # try:
            random.seed(year+day)
            if index != 0:
                current = list(filter(lambda x: x['answer'] == True, rollcall[index]))[0]
                print(f'\n{current}\n')
            if current['category'] == 'primaryTitle':
                df = cast[cast['primaryTitle'] == current['name']]
                n = [v.to_dict() for k, v in actors[actors['name'].isin(df['nconst'].tolist())].iterrows() if v['name'] not in [x['name'] for x in rollcall]]    
            else:
                df = cast[cast['nconst'] == current['name']]
                n = [v.to_dict() for k, v in movies[movies['name'].isin(df['primaryTitle'].tolist())].iterrows() if v['name'] not in [x['name'] for x in rollcall]]
            c = random.choices(n, weights=[i['weight'] for i in n], k=1)[0]
            c['answer'] = True
            rollcall.append(getChoices(cast, actors, movies, current, year+day))
            index += 1
        # except:
        #     break
    return render_template('index.html', data=rollcall)

if __name__ == '__main__':
    app.run()
