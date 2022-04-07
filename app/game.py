import random

def getWrongAnswers(answer, cast, actors, movies, rollcall, seed):
    quartiles = ['Q1', 'Q2', 'Q3', 'Q4']
    quartiles.remove(answer['quartile'])
    answers = [answer]
    if answer['category'] == 'primaryTitle':
        df = movies[~movies['name'].isin(cast[cast['nconst'] == answer['name']]['primaryTitle'].tolist())]
    else:
        df = actors[~actors['name'].isin(cast[cast['primaryTitle'] == answer['name']]['nconst'].tolist())]
    for q in quartiles:
        a = df[df['quartile'] == q].sample(n=1, random_state=seed).iloc[0].to_dict()
        a['answer'] = False
        answers.append(a)
    random.seed(seed)
    return random.sample(answers, len(answers))
